import React, { useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';

interface FileUploadProps {
  onFileChange?: (fileUrl: string | null) => void;
}

const CLOUDINARY_CLOUD_NAME = "dtqq94h3t"; 
const CLOUDINARY_UPLOAD_PRESET = "chatroom-preset";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url; // Short URL from Cloudinary
    } catch (error) {
      console.error("Cloudinary Upload Failed:", error);
      throw new Error("Failed to upload image.");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    setError('');
    setPreview(null);
    
    if (!files || files.length === 0) {
      setSelectedFile(null);
      if (onFileChange) onFileChange(null);
      return;
    }
    
    const file = files[0];
    
    setIsLoading(true);
    
    try {
      setSelectedFile(file);
      const cloudinaryUrl = await uploadToCloudinary(file);
      setPreview(cloudinaryUrl);
      const publicId = cloudinaryUrl.replace(CLOUDINARY_BASE_URL, ""); //since the usericon strings are getting truncated, we are only sending the hash aka public id, which we will re-construct later
      if (onFileChange) onFileChange(publicId);
    } catch (err) {
      setError('Failed to upload image to Cloudinary.');
      console.error('Cloudinary upload error:', err);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onFileChange) onFileChange(null);
  };

  return (
    <div className={`file-upload`}>
      <div className="flex items-center gap-4">
        <label 
          className={`px-4 py-2 border rounded cursor-pointer ${
            isLoading ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Uploading...' : selectedFile ? 'Change Image' : 'Select Image'}
          <input
            ref={fileInputRef}
            type="file"
            accept={'.jpg,.png'}
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        
        {selectedFile && (
          <button 
            type="button" 
            onClick={handleClear}
            className="text-red-500 hover:text-red-700"
            disabled={isLoading}
          >
            Clear
          </button>
        )}
      </div>
      
      {isLoading && <p className="mt-2 text-sm text-gray-600">Uploading to Cloudinary...</p>}
      
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="border p-2 max-w-xs">
            <img src={preview} alt="Preview" className="max-w-full h-auto" />
          </div>
        </div>
      )}
      
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default FileUpload;
