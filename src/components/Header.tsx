import { LogOut, Package, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { logout } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const projectName = config?.projectName || 'PPE Manager';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Product Processing Entries</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/change-password')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Key className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Change Password</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
