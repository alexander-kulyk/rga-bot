//core
import { useState } from 'react';
import axios from 'axios';
//api
import { file } from '../api';

interface IUploadFile {
  uploadFile: (selectedFile: File) => Promise<void>;
  uploading: boolean;
  uploadError: string;
  uploadSuccess: boolean;
}

export const useUploadFile = (): IUploadFile => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const uploadFile = async (selectedFile: File): Promise<void> => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const fileParams = { file: selectedFile };
      await file.upload(fileParams);

      setUploadSuccess(true);
      setUploadError('');
    } catch (error) {
      console.error('Upload failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Upload failed';
        setUploadError(errorMessage);
      } else {
        setUploadError('An unexpected error occurred during upload');
      }

      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    uploadError,
    uploadSuccess,
  };
};
