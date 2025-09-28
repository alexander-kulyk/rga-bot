//core
import { useState } from 'react';
import axios from 'axios';
//api
import { file } from '../api';

interface IUploadFile {
  uploadFile: (selectedFile: File) => Promise<void>;
  handleFileUpload: () => void;
  uploading: boolean;
  uploadError: string;
  uploadSuccess: boolean;
}

interface IProps {
  fetchFileOptions: () => Promise<void>;
}

export const useUploadFile = ({ fetchFileOptions }: IProps): IUploadFile => {
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
      await fetchFileOptions();
    } catch (error) {
      console.error('Upload failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || error.message || 'Upload failed';
        setUploadError(errorMessage);
      } else {
        setUploadError('An unexpected error occurred during upload');
      }

      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.doc,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await uploadFile(file);
      }
    };
    input.click();
  };

  return {
    handleFileUpload,
    uploadSuccess,
    uploadError,
    uploadFile,
    uploading,
  };
};
