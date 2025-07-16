import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import { useAuth } from './authProvider';
import { fetchSubmissions, sortSubmissionsByDate, type Submission } from '../helpers/submissionApiHelper';

interface SubmissionContextType {
  activeSubmission: Submission | null;
  setActiveSubmission: (submission: Submission | null) => void;
  submissions: Submission[];
  refreshSubmissions: () => Promise<void>;
  isLoading: boolean;
  createNewSubmission: () => void;
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
  const [rawSubmissions, setRawSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldAutoSelect, setShouldAutoSelect] = useState(true);

  // Memoize the sorted submissions at component level
  const submissions = useMemo(
    () => sortSubmissionsByDate(rawSubmissions),
    [rawSubmissions]
  );

  // Auto-select top submission if none is selected and auto-select is enabled
  useEffect(() => {
    if (shouldAutoSelect && !activeSubmission && submissions.length > 0) {
      setActiveSubmission(submissions[0]);
    }
  }, [submissions, activeSubmission, shouldAutoSelect]);

  const refreshSubmissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const data = await fetchSubmissions(user.id);
      setRawSubmissions(data);
      
      if (activeSubmission && !data.find(s => s.id === activeSubmission.id)) {
        setActiveSubmission(null);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSubmission = () => {
    setShouldAutoSelect(false);
    setActiveSubmission(null);
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
    createNewSubmission
  };

  return (
    <SubmissionContext.Provider value={value}>
      {children}
    </SubmissionContext.Provider>
  );
};

export default SubmissionProvider;