import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  documentType: string;
  title: string;
  description: string;
  accept: string;
  maxSize: number; // in MB
  onUpload: (file: File) => Promise<void>;
  uploadedFileName?: string;
  isUploaded?: boolean;
  isVerified?: boolean;
  onRemove?: () => void;
  onView?: () => void;
}

export function FileUpload({
  documentType,
  title,
  description,
  accept,
  maxSize,
  onUpload,
  uploadedFileName,
  isUploaded = false,
  isVerified = false,
  onRemove,
  onView,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (file: File) => {
    setError(null);
    
    // Validate file type
    const fileType = file.type;
    const validTypes = accept.split(",").map(type => type.trim());
    
    if (!validTypes.some(type => fileType.match(type))) {
      setError(`Invalid file type. Please upload ${accept} files only.`);
      return;
    }
    
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }
    
    // Upload file
    try {
      setIsUploading(true);
      await onUpload(file);
      toast({
        title: "File uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      setError("Failed to upload file. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getStatusBadge = () => {
    if (isVerified) {
      return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Verified</span>;
    }
    if (isUploaded) {
      return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Uploaded</span>;
    }
    return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">Not Uploaded</span>;
  };

  return (
    <Card className="rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>
      
      {isUploaded && uploadedFileName ? (
        <div className="mt-4">
          <div className="flex items-center justify-between p-2 rounded-md bg-slate-50">
            <div className="flex items-center">
              <File className="h-4 w-4 text-slate-500 mr-2" />
              <span className="text-sm text-slate-700">{uploadedFileName}</span>
            </div>
            <div className="flex items-center gap-2">
              {onView && (
                <Button variant="ghost" size="sm" onClick={onView} className="p-1 h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onRemove && (
                <Button variant="ghost" size="sm" onClick={onRemove} className="p-1 h-8 w-8 text-red-500 hover:text-red-700">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div 
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
              isDragging ? "bg-primary-50 border-primary-300" : "bg-slate-50 hover:bg-slate-100 border-slate-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-sm text-slate-500">Uploading...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="h-6 w-6 mb-2" />
                <p className="text-sm text-center px-4">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-6 w-6 text-slate-400 mb-2" />
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">{accept.replace(/\./g, '').toUpperCase()} (MAX. {maxSize}MB)</p>
              </div>
            )}
            <input 
              id={`file-upload-${documentType}`}
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept={accept}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
