import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './authProvider';
import { fetchSubmissions, type Submission } from '../helpers/submissionApiHelper';

interface SubmissionContextType {
  activeSubmission: Submission | null;
  setActiveSubmission: (submission: Submission | null) => void;
  submissions: Submission[];
  refreshSubmissions: () => Promise<void>;
  isLoading: boolean;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmission must be used within a SubmissionProvider');
  }
  return context;
};

interface SubmissionProviderProps {
  children: ReactNode;
}

export const SubmissionProvider: React.FC<SubmissionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSubmissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const data = await fetchSubmissions(user.id);
      setSubmissions(data);
      if (activeSubmission && !data.find(s => s.id === activeSubmission.id)) {
        setActiveSubmission(null);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSubmissions();
  }, [user]);



  const value: SubmissionContextType = {
    activeSubmission,
    setActiveSubmission,
    submissions,
    refreshSubmissions,
    isLoading,
  };

  return (
    <SubmissionContext.Provider value={value}>
      {children}
    </SubmissionContext.Provider>
  );
}; 