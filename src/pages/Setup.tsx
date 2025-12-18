import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useConfig, ConfigProvider } from '@/context/ConfigContext';
import { updateProjectName } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SetupContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { config, refreshConfig } = useConfig();
  const [projectName, setProjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if setup is already done (project name exists and is not the default)
    if (config?.projectName && config.projectName !== 'PPE Manager') {
      // Already configured, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    // If config exists but projectName is default, allow setup
    if (config?.projectName === 'PPE Manager') {
      setProjectName('PPE Manager');
    }
  }, [config, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProjectName(projectName.trim());
      await refreshConfig();
      toast({
        title: 'Success',
        description: 'Project name has been set successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting project name:', error);
      toast({
        title: 'Error',
        description: 'Failed to set project name. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card-elevated">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome!</h1>
            <p className="text-muted-foreground mt-1">Let's set up your project</p>
          </div>

          {/* Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This name will be displayed in the header. You can change it later from the settings.
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              <Check className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Setting up...' : 'Continue'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This is a one-time setup
          </p>
        </div>
      </div>
    </div>
  );
};

const Setup = () => {
  return (
    <ConfigProvider>
      <SetupContent />
    </ConfigProvider>
  );
};

export default Setup;

