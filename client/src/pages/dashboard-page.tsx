import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ApplicationStatus } from "@/components/application-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
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
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Application Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome to Karatina University Admission System</p>
          </div>
          
          {/* Application Status Card */}
          <ApplicationStatus 
            application={application} 
            isLoading={isLoadingApplication} 
          />
          
          {/* Informational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Application Guidelines</CardTitle>
                <CardDescription>Important information about the application process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li>Complete all sections of the application form accurately</li>
                  <li>Upload all required documents in the specified format</li>
                  <li>Ensure your contact information is up to date</li>
                  <li>Review your application before final submission</li>
                  <li>Applications can be saved as drafts and completed later</li>
                  <li>Once submitted, applications cannot be edited without admin approval</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
                <CardDescription>Key deadlines for the admission process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Application Opens</span>
                    <span className="text-slate-600">July 1, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Application Deadline</span>
                    <span className="text-slate-600">August 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Document Verification Period</span>
                    <span className="text-slate-600">August 16-30, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Admission Announcements</span>
                    <span className="text-slate-600">September 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">Reporting Date</span>
                    <span className="text-slate-600">October 1, 2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Help & Support Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get assistance with your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Contact Admissions</h3>
                  <p className="text-sm text-slate-600 mb-2">Need help with your application?</p>
                  <div className="text-sm text-slate-700">
                    <p>Email: admissions@karu.ac.ke</p>
                    <p>Phone: +254 (0)716 135 171</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Technical Support</h3>
                  <p className="text-sm text-slate-600 mb-2">Issues with the application system?</p>
                  <div className="text-sm text-slate-700">
                    <p>Email: support@karu.ac.ke</p>
                    <p>Phone: +254 (0)723 683 150</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">FAQs</h3>
                  <p className="text-sm text-slate-600 mb-2">Common questions about admission</p>
                  <a href="#" className="text-sm text-primary-600 hover:underline">
                    View Frequently Asked Questions
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
