import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ApplicationForm } from "@/components/application-form";
import { useAuth } from "@/hooks/use-auth";

export default function ApplicationPage() {
  const { user } = useAuth();

  // Fetch user's application
  const {
    data: application,
    isLoading: isLoadingApplication,
  } = useQuery<Application | null>({
    queryKey: ["/api/applications/user"],
    retry: false,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Application Form</h1>
            <p className="mt-2 text-slate-600">
              {application?.status === "submitted" 
                ? "Review your submitted application" 
                : "Complete all sections of the application form"}
            </p>
          </div>
          
          {/* Application Form Component */}
          <ApplicationForm 
            application={application} 
            isLoading={isLoadingApplication} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
