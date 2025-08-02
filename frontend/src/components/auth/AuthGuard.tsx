import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth, useDemoAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading, signIn, signUp, error, clearError } = useAuth();
  const { loginAsOwner, loginAsAdmin, loginAsEditor, loginAsViewer } = useDemoAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  // Clear form and errors when switching tabs
  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    });
    clearError();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    clearError();

    try {
      const success = await signIn({
        email: formData.email,
        password: formData.password
      });

      if (success) {
        toast.success('Welcome back!');
      }
    } catch (err) {
      toast.error('Sign in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    clearError();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setAuthLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setAuthLoading(false);
      return;
    }

    try {
      const success = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'viewer'
      });

      if (success) {
        toast.success('Account created successfully!');
      }
    } catch (err) {
      toast.error('Sign up failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'owner' | 'admin' | 'editor' | 'viewer') => {
    setAuthLoading(true);
    clearError();

    try {
      let success = false;
      switch (role) {
        case 'owner':
          success = await loginAsOwner();
          break;
        case 'admin':
          success = await loginAsAdmin();
          break;
        case 'editor':
          success = await loginAsEditor();
          break;
        case 'viewer':
          success = await loginAsViewer();
          break;
      }

      if (success) {
        toast.success(`Logged in as ${role}`);
      } else {
        toast.error(`Failed to login as ${role}`);
      }
    } catch (err) {
      toast.error('Demo login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Pixel8 Social Hub</h1>
            <p className="text-slate-300">Multi-platform social media management</p>
          </div>

          {/* Auth Form */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Welcome</CardTitle>
              <CardDescription className="text-slate-300">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" onValueChange={clearForm}>
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white/20">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white/20">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Login */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-white text-lg">Demo Access</CardTitle>
              <CardDescription className="text-slate-300 text-sm">
                Try different user roles
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('owner')}
                disabled={authLoading}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                disabled={authLoading}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('editor')}
                disabled={authLoading}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('viewer')}
                disabled={authLoading}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                Viewer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}