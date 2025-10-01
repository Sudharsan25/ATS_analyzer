import React, { useEffect, useState } from 'react';
import { usePuterStore } from 'lib/puter';

interface UploadedResume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  resumePath: string;
  createdAt?: string;
}

interface UploadedResumesProps {
  onResumeSelect?: (resume: UploadedResume) => void;
  selectedResumeId?: string;
}

const UploadedResumes: React.FC<UploadedResumesProps> = ({ 
  onResumeSelect, 
  selectedResumeId 
}) => {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<UploadedResume[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserResumes = async () => {
      if (!auth.isAuthenticated || !auth.user?.username) return;
      
      setLoading(true);
      try {
        console.log('UploadedResumes: Loading resumes for user:', auth.user?.username);
        
        const allResumes = (await kv.list('resume:*', true)) as KVItem[];
        console.log('UploadedResumes: Raw resume data from KV:', allResumes);
        
        const parsedResumes = allResumes?.map((resume) => {
          try {
            const parsed = JSON.parse(resume.value) as Resume;
            console.log('UploadedResumes: Parsed resume:', parsed);
            return parsed;
          } catch (error) {
            console.error('UploadedResumes: Error parsing resume:', error, 'Raw value:', resume.value);
            return null;
          }
        }).filter(Boolean) as Resume[];

        console.log('UploadedResumes: All parsed resumes:', parsedResumes);

        // Filter resumes by current user and extract only needed fields
        const userResumes = parsedResumes
          .filter((resume) => {
            const matches = resume.userId === auth.user?.username;
            console.log('UploadedResumes: Resume user match:', { 
              resumeUserId: resume.userId, 
              currentUser: auth.user?.username, 
              matches 
            });
            return matches;
          })
          .map((resume) => ({
            id: resume.id,
            companyName: resume.companyName,
            jobTitle: resume.jobTitle,
            resumePath: resume.resumePath,
            createdAt: resume.createdAt,
          }))
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        console.log('UploadedResumes: Filtered user resumes:', userResumes);
        setResumes(userResumes);
      } catch (error) {
        console.error('UploadedResumes: Error loading resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserResumes();
  }, [auth.isAuthenticated, auth.user?.username, kv]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Loading your resumes...</div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No previously uploaded resumes found.</p>
        <p className="text-sm mt-1">Upload a new resume below.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Your Previously Uploaded Resumes
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className={`resume-selection-item ${
              selectedResumeId === resume.id ? 'selected' : ''
            }`}
            onClick={() => onResumeSelect?.(resume)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <img src="/icons/pdf.png" alt="PDF" className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {resume.companyName && resume.jobTitle 
                        ? `${resume.companyName} - ${resume.jobTitle}`
                        : resume.companyName || resume.jobTitle || 'Resume'
                      }
                    </p>
                    {resume.createdAt && (
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {selectedResumeId === resume.id && (
                <div className="ml-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedResumes;