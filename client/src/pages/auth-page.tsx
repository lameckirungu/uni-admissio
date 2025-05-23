import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { School, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema, loginUserSchema } from "@shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if already logged in, based on user role
  if (user) {
    if (user.role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
    return null;
  }

  // Student Login form
  const studentLoginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Admin Login form
  const adminLoginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "student",
    },
  });

  const onStudentLoginSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    await loginMutation.mutateAsync(data);
  };

  const onAdminLoginSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    await loginMutation.mutateAsync(data);
  };

  const onRegisterSubmit = async (data: z.infer<typeof insertUserSchema>) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left panel with form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <School className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-semibold text-slate-900">Admissio</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Karatina University</CardTitle>
            <CardDescription>
              Enter your email and password to access your admission application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login" className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>Student</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Student Login Tab */}
              <TabsContent value="login">
                <form onSubmit={studentLoginForm.handleSubmit(onStudentLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-login-email">Email</Label>
                    <Input 
                      id="student-login-email" 
                      type="email"
                      placeholder="you@example.com"
                      {...studentLoginForm.register("username")}
                    />
                    {studentLoginForm.formState.errors.username && (
                      <p className="text-sm text-red-500">{studentLoginForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-login-password">Password</Label>
                      <a className="text-xs text-primary-600 hover:underline" href="#">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="student-login-password" 
                      type="password"
                      {...studentLoginForm.register("password")}
                    />
                    {studentLoginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{studentLoginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Student Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Admin Login Tab */}
              <TabsContent value="admin">
                <form onSubmit={adminLoginForm.handleSubmit(onAdminLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-login-email">Admin Email</Label>
                    <Input 
                      id="admin-login-email" 
                      type="email"
                      placeholder="admin@karu.ac.ke"
                      {...adminLoginForm.register("username")}
                    />
                    {adminLoginForm.formState.errors.username && (
                      <p className="text-sm text-red-500">{adminLoginForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-login-password">Admin Password</Label>
                    <Input 
                      id="admin-login-password" 
                      type="password"
                      {...adminLoginForm.register("password")}
                    />
                    {adminLoginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{adminLoginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Admin Sign In"}
                  </Button>
                </form>
                <div className="mt-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="font-medium text-slate-700">Admin Access Only</p>
                  <p>This area is restricted to administrative staff of Karatina University for managing student applications.</p>
                </div>
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email"
                      placeholder="you@example.com"
                      {...registerForm.register("username")}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password"
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <input type="hidden" {...registerForm.register("role")} value="student" />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-slate-500 text-center">
              By continuing, you agree to Karatina University's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right panel with marketing content */}
      <div className="hidden lg:block lg:w-1/2 bg-primary-700 text-white">
        <div className="flex flex-col justify-center h-full max-w-lg mx-auto p-8">
          <h1 className="text-4xl font-bold mb-6">Start Your Academic Journey</h1>
          <p className="text-lg mb-8">
            Karatina University's digital admission portal helps you complete your 
            application process easily and efficiently.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Easy Application Process</h3>
                <p className="text-primary-100">Complete your application online with our step-by-step form</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Digital Document Uploads</h3>
                <p className="text-primary-100">Upload all required documents securely online</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Real-time Status Updates</h3>
                <p className="text-primary-100">Track your application status throughout the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
