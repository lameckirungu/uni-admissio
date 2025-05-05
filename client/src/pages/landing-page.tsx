import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard"); // Student dashboard
      }
    } else if (!isLoading && !user) {
      // Not authenticated, redirect to login
      setLocation("/auth");
    }
  }, [isLoading, user, setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <span className="ml-2 text-lg text-slate-600">Redirecting...</span>
    </div>
  );
}