import {create } from 'zustand';


interface User {
    userId: string,
    userName: string,
    email: string,
    password: string,
}

interface ATSAnalysis {
    userId: string,
    companyName?: string,
    jobTitle?: string,
    imagePath: string,
    resumePath: string,
    feedback: Feedback;

}


interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface ATSStore  {
    // user: {
    //     user: User | null;
    //     isAuthenticated: boolean;
    //     signIn: () => Promise<void>;
    //     signOut: () => Promise<void>;
    //     refreshUser: () => Promise<void>;
    //     checkAuthStatus: () => Promise<boolean>;
    //     getUser: () => PuterUser | null;
    // },
    // analysis:{
    //     analysis: ATSAnalysis
    // }
    counter: number,
    increment: () => void,
    decrement:  () => void,
}


export const useATSStore = create<ATSStore>((set, get) => ({
    counter: 0,
    increment: () => {
        set( (state) => ({ counter: state.counter + 1} ) );
    },
    decrement: () => {
        set( (state) => ({ counter: state.counter - 1} ) );
    }
}))