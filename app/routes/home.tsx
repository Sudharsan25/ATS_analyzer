import NavBar from "~/components/NavBar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
// Update the import path to the correct location where 'resumes' is exported
import { resumes } from "../../constants"
import { usePuterStore } from 'lib/puter'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ATS Resume Analyzer" },
    { name: "description", content: "Analyze your resumes and get ATS score!" },
  ];
}

export default function Home() {

  const {isLoading, error, auth } = usePuterStore((state) => state);

  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <NavBar />
      <section className="main-section">
        <div className="page-heading">
          <h1> Upload your resume and get instant feedback!</h1>
          <h2> Review seperate feeback for each file upload, and modify accordingly!! </h2>
        </div>
      
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume}/>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
