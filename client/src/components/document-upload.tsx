import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Application, Document } from "@shared/schema";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentUploadProps {
  application?: Application | null;
  isLoading: boolean;
}

export function DocumentUpload({ application, isLoading }: DocumentUploadProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // If the user is not a student, don't allow access
  const isStudent = user?.role === "student";

  // Fetch documents if there's an application
  const {
    data: fetchedDocuments,
    isLoading: isLoadingDocuments,
  } = useQuery<Document[]>({
    queryKey: application ? [`/api/documents/${application.id}`] : ["none"],
    enabled: !!application?.id,
  });

  useEffect(() => {
    if (fetchedDocuments) {
      setDocuments(fetchedDocuments);
    }
  }, [fetchedDocuments]);

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      documentType,
    }: {
      file: File;
      documentType: string;
    }) => {
      if (!application?.id) {
        throw new Error("No application found");
      }

      // In a real application, we would upload to a storage service here
      // For simplicity, we'll just simulate the file upload
      const fileName = file.name;
      const storagePath = `documents/${application.id}/${documentType}/${fileName}`;

      // Create document entry in database
      const res = await apiRequest("POST", "/api/documents", {
        applicationId: application.id,
        documentType,
        fileName,
        storagePath,
      });

      return await res.json();
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${application?.id}`] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });

      // Update local documents array
      setDocuments((prev) => {
        const filtered = prev.filter(
          (doc) => doc.documentType !== newDocument.documentType
        );
        return [...filtered, newDocument];
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
    },
  });

  // Remove document mutation
  const removeMutation = useMutation({
    mutationFn: async (documentId: number) => {
      if (!application?.id) {
        throw new Error("No application found");
      }

      // In a real application, we would also remove from storage here
      // For this demo, we'll just simulate success

      // We would typically call an API to delete the document
      // For simplicity, we'll just simulate success
      return documentId;
    },
    onSuccess: (documentId) => {
      // Update local documents array
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));

      toast({
        title: "Document removed",
        description: "Your document has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove document.",
        variant: "destructive",
      });
    },
  });

  // Find document by type
  const getDocumentByType = (type: string) => {
    return documents.find((doc) => doc.documentType === type);
  };

  // Handle file upload
  const handleFileUpload = async (file: File, documentType: string) => {
    await uploadMutation.mutateAsync({ file, documentType });
  };

  // Handle document removal
  const handleRemoveDocument = async (documentId: number) => {
    await removeMutation.mutateAsync(documentId);
  };

  // Handle view document
  const handleViewDocument = (storagePath: string) => {
    // In a real application, we would generate a URL to view the document
    toast({
      title: "Document View",
      description: `In a production environment, this would open: ${storagePath}`,
    });
  };

  if (isLoading || isLoadingDocuments) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-1 h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-md border border-slate-200 p-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-4 w-36 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-6 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="mt-4">
                  <div className="h-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error message if the user is not a student
  if (!isStudent) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Access Denied</h2>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-6 gap-4 text-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-600">Administrator Access Restricted</h3>
            <p className="text-slate-600 max-w-md">
              This document upload section is only accessible to student users. As an administrator, 
              you do not have permission to upload or manage student documents.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Required Documents</h2>
          <p className="text-sm text-slate-600">Please start an application before uploading documents.</p>
        </div>
      </Card>
    );
  }

  // Documents to be uploaded
  const nationalIdDoc = getDocumentByType("nationalId");
  const kcseDoc = getDocumentByType("kcseResults");
  const kcpeDoc = getDocumentByType("kcpeResults");
  const passportPhotoDoc = getDocumentByType("passportPhoto");

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Required Documents</h2>
        <p className="text-sm text-slate-600">Upload the following documents in PDF, JPG, or PNG format (max 10MB each)</p>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* National ID / Birth Certificate */}
          <FileUpload
            documentType="nationalId"
            title="National ID / Birth Certificate"
            description="Required document for identity verification"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10}
            onUpload={(file) => handleFileUpload(file, "nationalId")}
            uploadedFileName={nationalIdDoc?.fileName}
            isUploaded={!!nationalIdDoc}
            isVerified={nationalIdDoc?.verified || false}
            onRemove={nationalIdDoc ? () => handleRemoveDocument(nationalIdDoc.id) : undefined}
            onView={nationalIdDoc ? () => handleViewDocument(nationalIdDoc.storagePath) : undefined}
          />

          {/* KCSE Certificate / Result Slip */}
          <FileUpload
            documentType="kcseResults"
            title="KCSE Certificate / Result Slip"
            description="Required document for education verification"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10}
            onUpload={(file) => handleFileUpload(file, "kcseResults")}
            uploadedFileName={kcseDoc?.fileName}
            isUploaded={!!kcseDoc}
            isVerified={kcseDoc?.verified || false}
            onRemove={kcseDoc ? () => handleRemoveDocument(kcseDoc.id) : undefined}
            onView={kcseDoc ? () => handleViewDocument(kcseDoc.storagePath) : undefined}
          />

          {/* KCPE Certificate */}
          <FileUpload
            documentType="kcpeResults"
            title="KCPE Certificate"
            description="Required document for primary education verification"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10}
            onUpload={(file) => handleFileUpload(file, "kcpeResults")}
            uploadedFileName={kcpeDoc?.fileName}
            isUploaded={!!kcpeDoc}
            isVerified={kcpeDoc?.verified}
            onRemove={kcpeDoc ? () => handleRemoveDocument(kcpeDoc.id) : undefined}
            onView={kcpeDoc ? () => handleViewDocument(kcpeDoc.storagePath) : undefined}
          />

          {/* Passport Photo */}
          <FileUpload
            documentType="passportPhoto"
            title="Passport Photo"
            description="Recent passport-sized photograph with blue background"
            accept=".jpg,.jpeg,.png"
            maxSize={5}
            onUpload={(file) => handleFileUpload(file, "passportPhoto")}
            uploadedFileName={passportPhotoDoc?.fileName}
            isUploaded={!!passportPhotoDoc}
            isVerified={passportPhotoDoc?.verified}
            onRemove={passportPhotoDoc ? () => handleRemoveDocument(passportPhotoDoc.id) : undefined}
            onView={passportPhotoDoc ? () => handleViewDocument(passportPhotoDoc.storagePath) : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
}
