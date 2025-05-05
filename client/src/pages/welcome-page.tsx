import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";

export default function WelcomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users based on role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, setLocation]);

  // If user is not authenticated, show welcome message
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <School className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-slate-900">Admissio</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mt-2 mb-4">
          Karatina University Admission System
        </h1>
        
        <p className="text-center text-slate-600 max-w-md mb-8">
          Welcome to Admissio, the digital admission management system for Karatina University.
          Please sign in to continue.
        </p>
        
        <Button
          onClick={() => setLocation("/auth")}
          size="lg"
          className="px-8 py-6 text-lg"
        >
          Sign In / Register
        </Button>
      </div>
      
      <footer className="py-6 px-4 border-t border-slate-200 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Karatina University. All rights reserved.
      </footer>
    </div>
  );
}