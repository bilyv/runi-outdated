import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

interface FileType {
  _id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  updated_at: number;
  folder_id?: string;
}

export function Files() {
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Fetch files from Convex
  const files = useQuery(api.files.list, { folderId: undefined }) || [];
  
  const handleViewFile = (file: FileType) => {
    setSelectedFile(file);
    setIsViewModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFile(null);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-6">Files</h2>
      
      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file: FileType) => (
            <div 
              key={file._id} 
              className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mr-3 flex-shrink-0">
                  {isImageFile(file.file_type) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-dark-text truncate">{file.file_name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(file.updated_at)}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>{formatFileSize(file.file_size)}</span>
                <span className="truncate ml-2">{file.file_type.split('/')[1] || file.file_type}</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-center"
                onClick={() => handleViewFile(file)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-1">No files found</h3>
          <p className="text-gray-500 dark:text-gray-400">Upload some files to see them here</p>
        </div>
      )}
      
      {/* File View Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={handleCloseViewModal} 
        title={selectedFile?.file_name || "File Preview"}
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">Type: {selectedFile.file_type}</span>
              <span>Size: {formatFileSize(selectedFile.file_size)}</span>
            </div>
            
            <div className="border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
              {isImageFile(selectedFile.file_type) ? (
                <img 
                  src={selectedFile.file_url} 
                  alt={selectedFile.file_name}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Preview not available for this file type</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">This file is not an image and cannot be previewed</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="secondary" 
                onClick={handleCloseViewModal}
              >
                Close
              </Button>
              <a 
                href={selectedFile.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}