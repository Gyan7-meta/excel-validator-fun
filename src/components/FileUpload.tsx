
import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { UploadStatus } from '@/types';
import { isExcelFile, validateExcelFile } from '@/utils/validators';
import { Check, File, Upload, X } from 'lucide-react';

interface FileUploadProps {
  onValidationComplete: (result: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onValidationComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0,
    message: 'Drop your Excel file here or click to browse'
  });
  const { toast } = useToast();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Simulate upload progress
  const simulateUploadProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus(prev => ({
          ...prev,
          status: 'validating',
          progress: 100,
          message: 'Upload complete. Validating data...'
        }));
      } else {
        setUploadStatus(prev => ({
          ...prev,
          progress
        }));
      }
    }, 100);
  }, []);

  // Handle file upload
  const handleFile = useCallback(async (file: File) => {
    if (!isExcelFile(file)) {
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'Invalid file type. Please upload an Excel file.',
        error: 'Only Excel files (.xlsx, .xls, .ods) are supported.'
      });
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please upload a valid Excel file."
      });
      return;
    }

    try {
      // Reset state
      setUploadStatus({
        status: 'uploading',
        progress: 0,
        message: `Uploading ${file.name}...`
      });

      // Simulate upload progress
      simulateUploadProgress();

      // Wait for "upload" to complete
      setTimeout(async () => {
        // Now validate the file
        try {
          const validationResult = await validateExcelFile(file);
          setUploadStatus({
            status: 'complete',
            progress: 100,
            message: validationResult.status === 'success' 
              ? 'Validation successful!' 
              : `Validation complete with ${validationResult.validationErrors.length} issues`
          });
          onValidationComplete(validationResult);
        } catch (error) {
          setUploadStatus({
            status: 'error',
            progress: 0,
            message: 'Validation failed',
            error: error instanceof Error ? error.message : 'Unknown error during validation'
          });
          toast({
            variant: "destructive",
            title: "Validation failed",
            description: "There was an error validating your file."
          });
        }
      }, 2000); // Simulate 2-second upload time
    } catch (error) {
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error during upload'
      });
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your file."
      });
    }
  }, [onValidationComplete, simulateUploadProgress, toast]);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // Handle input change event
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  // Get status icon
  const renderStatusIcon = () => {
    switch (uploadStatus.status) {
      case 'idle':
        return <Upload className="h-10 w-10 text-primary transition-all-300 group-hover:text-primary/80" />;
      case 'uploading':
        return <File className="h-10 w-10 text-primary animate-pulse" />;
      case 'validating':
        return <File className="h-10 w-10 text-primary animate-pulse" />;
      case 'complete':
        return <Check className="h-10 w-10 text-success animate-fade-in" />;
      case 'error':
        return <X className="h-10 w-10 text-destructive animate-fade-in" />;
      default:
        return <Upload className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 p-4
          border-2 border-dashed rounded-xl 
          bg-background/50 backdrop-blur-sm
          group cursor-pointer transition-all-300
          ${dragActive ? 'dropzone-active' : 'border-muted hover:border-primary/50'}
          ${uploadStatus.status === 'error' ? 'border-destructive/50' : ''}
          ${uploadStatus.status === 'complete' ? 'border-success/50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input 
          id="file-upload" 
          type="file" 
          className="hidden"
          onChange={handleChange}
          accept=".xls,.xlsx,.ods"
          disabled={uploadStatus.status === 'uploading' || uploadStatus.status === 'validating'}
        />

        {/* Icon and text container */}
        <label 
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-full space-y-4"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full p-3 bg-primary/10">
              {renderStatusIcon()}
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-medium text-lg">
                {uploadStatus.message}
              </p>
              
              {uploadStatus.error && (
                <p className="text-sm text-destructive">
                  {uploadStatus.error}
                </p>
              )}
              
              {(uploadStatus.status === 'idle' || uploadStatus.status === 'error') && (
                <p className="text-sm text-muted-foreground">
                  Supported formats: .xlsx, .xls, .ods
                </p>
              )}
            </div>
          </div>
        </label>

        {/* Progress bar */}
        {(uploadStatus.status === 'uploading' || uploadStatus.status === 'validating') && (
          <div className="absolute bottom-4 left-4 right-4">
            <Progress value={uploadStatus.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {uploadStatus.status === 'uploading' ? 'Uploading:' : 'Validating:'} {uploadStatus.progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
