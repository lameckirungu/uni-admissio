import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Application, Document } from "@shared/schema";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Download, 
  Plus, 
  ClipboardList, 
  Edit3, 
  Clock 
} from "lucide-react";

export default function AdminPage() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("details");

  // Fetch all applications
  const {
    data: applications,
    isLoading: isLoadingApplications,
  } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: user?.role === "admin",
  });

  // Fetch documents for selected application
  const {
    data: documents,
    isLoading: isLoadingDocuments,
  } = useQuery<Document[]>({
    queryKey: selectedApplication ? [`/api/documents/${selectedApplication.id}`] : ["none"],
    enabled: !!selectedApplication?.id,
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/applications/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Status updated",
        description: "The application status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  // Verify document mutation
  const verifyDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const res = await apiRequest("PATCH", `/api/documents/${documentId}/verify`, {});
      return await res.json();
    },
    onSuccess: () => {
      if (selectedApplication) {
        queryClient.invalidateQueries({ queryKey: [`/api/documents/${selectedApplication.id}`] });
      }
      toast({
        title: "Document verified",
        description: "The document has been verified successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify document.",
        variant: "destructive",
      });
    },
  });

  // Filter applications based on status and search term
  const filteredApplications = applications?.filter((app) => {
    // Filter by status
    if (statusFilter !== "all" && app.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const formData = app.formData as any;
      const fullName = `${formData?.personalInfo?.firstName || ""} ${formData?.personalInfo?.middleName || ""} ${formData?.personalInfo?.lastName || ""}`.toLowerCase();
      const idNumber = formData?.personalInfo?.nationalIdOrBirthCertNo?.toLowerCase() || "";
      
      return fullName.includes(searchTerm.toLowerCase()) || idNumber.includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  // Handle status update
  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutateAsync({ id, status });
  };

  // Handle document verification
  const handleVerifyDocument = (documentId: number) => {
    verifyDocumentMutation.mutateAsync(documentId);
  };

  // Format date string
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "N/A";
    
    const date = typeof dateString === 'string' 
      ? new Date(dateString) 
      : dateString;
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Submitted</Badge>;
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get applicant name from form data
  const getApplicantName = (application: Application) => {
    const formData = application.formData as any;
    return `${formData?.personalInfo?.firstName || ""} ${formData?.personalInfo?.middleName || ""} ${formData?.personalInfo?.lastName || ""}`;
  };

  // Get applicant ID from form data
  const getApplicantId = (application: Application) => {
    const formData = application.formData as any;
    return formData?.personalInfo?.nationalIdOrBirthCertNo || "N/A";
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You do not have permission to access this page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">This area is restricted to administrative users only.</p>
              <Button asChild>
                <a href="/">Return to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Admin Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Admin Dashboard</h1>
                <p className="mt-2 text-slate-600">Manage and review student applications</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="mr-2">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Admission
                </Button>
              </div>
            </div>
          </div>
          
          {/* Applications Overview Cards */}
          <div className="mb-6">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Applications Overview</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="rounded-full bg-slate-100 p-3 mr-4">
                      <ClipboardList className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">
                        {isLoadingApplications ? (
                          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                        ) : (
                          applications?.length || 0
                        )}
                      </div>
                      <div className="text-sm text-slate-500">Total Applications</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {isLoadingApplications ? (
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    ) : (
                      `${applications?.length} total submissions`
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="rounded-full bg-slate-100 p-3 mr-4">
                      <Edit3 className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">
                        {isLoadingApplications ? (
                          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                        ) : (
                          applications?.filter(app => app.status === "draft").length || 0
                        )}
                      </div>
                      <div className="text-sm text-slate-500">Drafts</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {isLoadingApplications ? (
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    ) : (
                      `${applications?.filter(app => app.status === "draft").length} incomplete applications`
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="rounded-full bg-amber-100 p-3 mr-4">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-amber-800">
                        {isLoadingApplications ? (
                          <div className="h-8 w-16 bg-amber-200 rounded animate-pulse"></div>
                        ) : (
                          applications?.filter(app => app.status === "submitted").length || 0
                        )}
                      </div>
                      <div className="text-sm text-amber-700">Submitted</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-amber-700">
                    {isLoadingApplications ? (
                      <div className="h-4 w-24 bg-amber-200 rounded animate-pulse"></div>
                    ) : (
                      `${applications?.filter(app => app.status === "submitted").length} pending review`
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-green-800">
                        {isLoadingApplications ? (
                          <div className="h-8 w-16 bg-green-200 rounded animate-pulse"></div>
                        ) : (
                          applications?.filter(app => app.status === "approved").length || 0
                        )}
                      </div>
                      <div className="text-sm text-green-700">Approved</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-700">
                    {isLoadingApplications ? (
                      <div className="h-4 w-24 bg-green-200 rounded animate-pulse"></div>
                    ) : (
                      `${applications?.filter(app => app.status === "approved").length} accepted students`
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-red-800">
                        {isLoadingApplications ? (
                          <div className="h-8 w-16 bg-red-200 rounded animate-pulse"></div>
                        ) : (
                          applications?.filter(app => app.status === "rejected").length || 0
                        )}
                      </div>
                      <div className="text-sm text-red-700">Rejected</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-red-700">
                    {isLoadingApplications ? (
                      <div className="h-4 w-24 bg-red-200 rounded animate-pulse"></div>
                    ) : (
                      `${applications?.filter(app => app.status === "rejected").length} declined applications`
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Applications Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
                  <p className="text-sm text-slate-500">Review and manage student applications</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Search by name or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full sm:w-auto"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-0">
              {isLoadingApplications ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-slate-100 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredApplications && filteredApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-medium text-slate-500">Name</TableHead>
                        <TableHead className="font-medium text-slate-500">ID Number</TableHead>
                        <TableHead className="font-medium text-slate-500">Status</TableHead>
                        <TableHead className="font-medium text-slate-500">Submitted</TableHead>
                        <TableHead className="font-medium text-slate-500 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium">{getApplicantName(application)}</TableCell>
                          <TableCell className="text-slate-600">{getApplicantId(application)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-slate-600">{formatDate(application.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setSelectedTab("details");
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                  <DialogDescription>
                                    Reviewing application from {getApplicantName(application)}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Application Details</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="status">Status Management</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="details" className="space-y-4 mt-4">
                                    {selectedApplication && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <h3 className="text-sm font-medium text-slate-900 mb-2">Personal Information</h3>
                                            <div className="rounded-md bg-slate-50 p-3 text-sm">
                                              <div className="grid grid-cols-2 gap-2">
                                                <div className="text-slate-500">Full Name:</div>
                                                <div>{getApplicantName(selectedApplication)}</div>
                                                
                                                <div className="text-slate-500">ID Number:</div>
                                                <div>{getApplicantId(selectedApplication)}</div>
                                                
                                                <div className="text-slate-500">Gender:</div>
                                                <div>{(selectedApplication.formData as any)?.personalInfo?.gender || "N/A"}</div>
                                                
                                                <div className="text-slate-500">Date of Birth:</div>
                                                <div>{(selectedApplication.formData as any)?.personalInfo?.dateOfBirth || "N/A"}</div>
                                                
                                                <div className="text-slate-500">Nationality:</div>
                                                <div>{(selectedApplication.formData as any)?.personalInfo?.nationality || "N/A"}</div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <h3 className="text-sm font-medium text-slate-900 mb-2">Contact Information</h3>
                                            <div className="rounded-md bg-slate-50 p-3 text-sm">
                                              <div className="grid grid-cols-2 gap-2">
                                                <div className="text-slate-500">Email:</div>
                                                <div>{(selectedApplication.formData as any)?.contactInfo?.email || "N/A"}</div>
                                                
                                                <div className="text-slate-500">Phone:</div>
                                                <div>{(selectedApplication.formData as any)?.contactInfo?.mobilePhone || "N/A"}</div>
                                                
                                                <div className="text-slate-500">Postal Address:</div>
                                                <div>{(selectedApplication.formData as any)?.contactInfo?.postalAddress || "N/A"}</div>
                                                
                                                <div className="text-slate-500">County:</div>
                                                <div>{(selectedApplication.formData as any)?.contactInfo?.county || "N/A"}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h3 className="text-sm font-medium text-slate-900 mb-2">Education Information</h3>
                                          <div className="rounded-md bg-slate-50 p-3 text-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <h4 className="font-medium mb-1">KCSE Information</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div className="text-slate-500">School:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcseSchool || "N/A"}</div>
                                                  
                                                  <div className="text-slate-500">Index Number:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcseIndex || "N/A"}</div>
                                                  
                                                  <div className="text-slate-500">Year:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcseYear || "N/A"}</div>
                                                </div>
                                                
                                                <div className="mt-2">
                                                  <div className="text-slate-500 mb-1">Results:</div>
                                                  <div className="whitespace-pre-wrap bg-white p-2 rounded border border-slate-200">
                                                    {(selectedApplication.formData as any)?.educationInfo?.kcseResults || "N/A"}
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <h4 className="font-medium mb-1">KCPE Information</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div className="text-slate-500">School:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcpeSchool || "N/A"}</div>
                                                  
                                                  <div className="text-slate-500">Index Number:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcpeIndex || "N/A"}</div>
                                                  
                                                  <div className="text-slate-500">Year:</div>
                                                  <div>{(selectedApplication.formData as any)?.educationInfo?.kcpeYear || "N/A"}</div>
                                                </div>
                                                
                                                <div className="mt-2">
                                                  <div className="text-slate-500 mb-1">Results:</div>
                                                  <div className="whitespace-pre-wrap bg-white p-2 rounded border border-slate-200">
                                                    {(selectedApplication.formData as any)?.educationInfo?.kcpeResults || "N/A"}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h3 className="text-sm font-medium text-slate-900 mb-2">Application Information</h3>
                                          <div className="rounded-md bg-slate-50 p-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                              <div className="text-slate-500">Application ID:</div>
                                              <div>{selectedApplication.id}</div>
                                              
                                              <div className="text-slate-500">Status:</div>
                                              <div>{getStatusBadge(selectedApplication.status)}</div>
                                              
                                              <div className="text-slate-500">Created:</div>
                                              <div>{formatDate(selectedApplication.createdAt)}</div>
                                              
                                              <div className="text-slate-500">Updated:</div>
                                              <div>{formatDate(selectedApplication.updatedAt)}</div>
                                              
                                              <div className="text-slate-500">Submitted:</div>
                                              <div>{formatDate(selectedApplication.submittedAt)}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </TabsContent>
                                  
                                  <TabsContent value="documents" className="space-y-4 mt-4">
                                    {isLoadingDocuments ? (
                                      <div className="space-y-4 animate-pulse">
                                        {[1, 2, 3, 4].map((i) => (
                                          <div key={i} className="h-20 bg-slate-100 rounded"></div>
                                        ))}
                                      </div>
                                    ) : documents && documents.length > 0 ? (
                                      <div className="space-y-4">
                                        {documents.map((document) => (
                                          <div 
                                            key={document.id} 
                                            className="flex items-center justify-between p-4 rounded-md border border-slate-200"
                                          >
                                            <div>
                                              <h4 className="text-sm font-medium text-slate-900">{document.documentType}</h4>
                                              <p className="text-sm text-slate-500">{document.fileName}</p>
                                              <p className="text-xs text-slate-400">Uploaded on {formatDate(document.uploadedAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {document.verified ? (
                                                <Badge className="bg-green-100 text-green-800">Verified</Badge>
                                              ) : (
                                                <Button 
                                                  size="sm" 
                                                  variant="outline" 
                                                  onClick={() => handleVerifyDocument(document.id)}
                                                  disabled={verifyDocumentMutation.isPending}
                                                >
                                                  {verifyDocumentMutation.isPending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                  ) : (
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                  )}
                                                  Verify
                                                </Button>
                                              )}
                                              <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => {
                                                  toast({
                                                    title: "View Document",
                                                    description: `In a production environment, this would open: ${document.storagePath}`,
                                                  });
                                                }}
                                              >
                                                <Eye className="h-4 w-4 mr-1" /> View
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-8">
                                        <p className="text-slate-500">No documents uploaded yet.</p>
                                      </div>
                                    )}
                                  </TabsContent>
                                  
                                  <TabsContent value="status" className="space-y-4 mt-4">
                                    {selectedApplication && (
                                      <div>
                                        <h3 className="text-sm font-medium text-slate-900 mb-2">Update Application Status</h3>
                                        <p className="text-sm text-slate-500 mb-4">Change the status of this application.</p>
                                        
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card className={`cursor-pointer border-2 ${selectedApplication.status === "submitted" ? "border-amber-500" : "border-transparent"}`}>
                                              <CardContent className="p-4">
                                                <h4 className="font-medium flex items-center text-amber-800">
                                                  <Badge className="bg-amber-100 text-amber-800 mr-2">Submitted</Badge>
                                                  Initial submission
                                                </h4>
                                                <p className="text-sm text-slate-500 mt-2">
                                                  Application has been submitted by the student and is awaiting review.
                                                </p>
                                                {selectedApplication.status !== "submitted" && (
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="mt-2"
                                                    onClick={() => handleStatusUpdate(selectedApplication.id, "submitted")}
                                                    disabled={updateStatusMutation.isPending}
                                                  >
                                                    Set as Submitted
                                                  </Button>
                                                )}
                                              </CardContent>
                                            </Card>
                                            
                                            <Card className={`cursor-pointer border-2 ${selectedApplication.status === "under_review" ? "border-blue-500" : "border-transparent"}`}>
                                              <CardContent className="p-4">
                                                <h4 className="font-medium flex items-center text-blue-800">
                                                  <Badge className="bg-blue-100 text-blue-800 mr-2">Under Review</Badge>
                                                  Being reviewed
                                                </h4>
                                                <p className="text-sm text-slate-500 mt-2">
                                                  Application is currently being reviewed by the admissions committee.
                                                </p>
                                                {selectedApplication.status !== "under_review" && (
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="mt-2"
                                                    onClick={() => handleStatusUpdate(selectedApplication.id, "under_review")}
                                                    disabled={updateStatusMutation.isPending}
                                                  >
                                                    Mark as Under Review
                                                  </Button>
                                                )}
                                              </CardContent>
                                            </Card>
                                            
                                            <Card className={`cursor-pointer border-2 ${selectedApplication.status === "approved" ? "border-green-500" : "border-transparent"}`}>
                                              <CardContent className="p-4">
                                                <h4 className="font-medium flex items-center text-green-800">
                                                  <Badge className="bg-green-100 text-green-800 mr-2">Approved</Badge>
                                                  Application accepted
                                                </h4>
                                                <p className="text-sm text-slate-500 mt-2">
                                                  Application has been approved. Student can proceed with enrollment.
                                                </p>
                                                {selectedApplication.status !== "approved" && (
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="mt-2"
                                                    onClick={() => handleStatusUpdate(selectedApplication.id, "approved")}
                                                    disabled={updateStatusMutation.isPending}
                                                  >
                                                    Approve Application
                                                  </Button>
                                                )}
                                              </CardContent>
                                            </Card>
                                            
                                            <Card className={`cursor-pointer border-2 ${selectedApplication.status === "rejected" ? "border-red-500" : "border-transparent"}`}>
                                              <CardContent className="p-4">
                                                <h4 className="font-medium flex items-center text-red-800">
                                                  <Badge className="bg-red-100 text-red-800 mr-2">Rejected</Badge>
                                                  Application declined
                                                </h4>
                                                <p className="text-sm text-slate-500 mt-2">
                                                  Application does not meet the requirements and has been rejected.
                                                </p>
                                                {selectedApplication.status !== "rejected" && (
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="mt-2"
                                                    onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                                                    disabled={updateStatusMutation.isPending}
                                                  >
                                                    Reject Application
                                                  </Button>
                                                )}
                                              </CardContent>
                                            </Card>
                                          </div>
                                          
                                          <div className="bg-slate-50 p-4 rounded-md">
                                            <h4 className="text-sm font-medium text-slate-900 mb-2">Current Status</h4>
                                            <div className="flex items-center">
                                              {getStatusBadge(selectedApplication.status)}
                                              <span className="ml-2 text-sm text-slate-500">
                                                Last Updated: {formatDate(selectedApplication.updatedAt)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No applications found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
