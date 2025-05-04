import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { DocumentUpload } from "@/components/document-upload";
import { useAuth } from "@/hooks/use-auth";

export default function DocumentsPage() {
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Document Upload</h1>
            <p className="mt-2 text-slate-600">Upload all required documents for your application</p>
          </div>
          
          {/* Document Upload Component */}
          <DocumentUpload 
            application={application} 
            isLoading={isLoadingApplication} 
          />
          
          {/* Document Requirements Card */}
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Document Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-900">File Format Requirements</h3>
                <p className="text-sm text-slate-600">All documents must be in PDF, JPG, or PNG format. Maximum file size is 10MB per document.</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900">Document Clarity</h3>
                <p className="text-sm text-slate-600">Ensure all documents are clear, legible, and complete. Documents that are blurry, cropped, or missing information will be rejected.</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900">Passport Photo Requirements</h3>
                <p className="text-sm text-slate-600">Passport photo must be recent, with blue background, showing full face with no headgear (unless worn for religious reasons).</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900">Document Verification</h3>
                <p className="text-sm text-slate-600">All uploaded documents will be verified by the admissions office. You may be required to present original copies during registration.</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900">Additional Documents</h3>
                <p className="text-sm text-slate-600">Depending on your program, additional documents may be required. You will be notified if any additional documents are needed.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
