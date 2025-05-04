import { Application } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ApplicationStatusProps {
  application?: Application | null;
  isLoading: boolean;
}

export function ApplicationStatus({ application, isLoading }: ApplicationStatusProps) {
  const { toast } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!application) return null;
      const res = await apiRequest("PATCH", `/api/applications/${application.id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/user"] });
      toast({
        title: "Application updated",
        description: "Your application status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update application status.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitApplication = async () => {
    await updateStatusMutation.mutateAsync("submitted");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">Draft</span>;
      case "submitted":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">Submitted</span>;
      case "under_review":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">Under Review</span>;
      case "approved":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const getProgressStep = (status: string) => {
    switch (status) {
      case "draft": return 2;
      case "submitted": return 3;
      case "under_review": return 4;
      case "approved": return 5;
      case "rejected": return 5;
      default: return 1;
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-6 w-1/4 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
            <div className="h-4 bg-slate-200 rounded mb-4"></div>
            <div className="h-10 bg-slate-200 rounded mb-4"></div>
            <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return (
      <Card className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Start Your Application</h2>
              <p className="mt-1 text-sm text-slate-500">Begin your application to Karatina University</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-between">
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">1</span>
                  <span className="ml-2 text-xs font-medium text-slate-600">Registration</span>
                </div>
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">2</span>
                  <span className="ml-2 text-xs font-medium text-slate-600">Application Form</span>
                </div>
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">3</span>
                  <span className="ml-2 text-xs font-medium text-slate-600">Document Upload</span>
                </div>
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">4</span>
                  <span className="ml-2 text-xs font-medium text-slate-600">Review</span>
                </div>
                <div className="flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">5</span>
                  <span className="ml-2 text-xs font-medium text-slate-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/apply">
              <Button className="w-full sm:w-auto">Start Application</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const step = getProgressStep(application.status);

  return (
    <Card className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Application</h2>
            <p className="mt-1 text-sm text-slate-500">Karatina University - Bachelor of Computer Science</p>
          </div>
          <div className="mt-4 sm:mt-0">
            {getStatusBadge(application.status)}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-between">
              <div className="flex items-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">1</span>
                <span className="ml-2 text-xs font-medium text-slate-600">Registration</span>
              </div>
              <div className="flex items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'} text-xs font-medium`}>2</span>
                <span className="ml-2 text-xs font-medium text-slate-600">Application Form</span>
              </div>
              <div className="flex items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'} text-xs font-medium`}>3</span>
                <span className="ml-2 text-xs font-medium text-slate-600">Document Upload</span>
              </div>
              <div className="flex items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 4 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'} text-xs font-medium`}>4</span>
                <span className="ml-2 text-xs font-medium text-slate-600">Review</span>
              </div>
              <div className="flex items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 5 ? (application.status === 'approved' ? 'bg-green-600 text-white' : application.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-primary-600 text-white') : 'bg-slate-200 text-slate-600'} text-xs font-medium`}>5</span>
                <span className="ml-2 text-xs font-medium text-slate-600">Completed</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {application.status === "draft" && (
            <>
              <Link href="/apply">
                <Button>Continue Application</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleSubmitApplication}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </>
          )}
          
          {application.status === "submitted" && (
            <>
              <Link href="/documents">
                <Button>View Documents</Button>
              </Link>
              <Link href="/apply">
                <Button variant="outline">View Application</Button>
              </Link>
            </>
          )}
          
          {["under_review", "approved", "rejected"].includes(application.status) && (
            <>
              <Link href="/apply">
                <Button variant="outline">View Application</Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline">View Documents</Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
