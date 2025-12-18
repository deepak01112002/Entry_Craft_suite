import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { config, isLoading } = useConfig();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if setup is needed (default project name means setup not done)
    if (config && config.projectName === 'PPE Manager') {
      navigate('/setup');
    } else if (config) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, config, isLoading, navigate]);

  return null;
};

export default Index;
