//core
import { useEffect, useState } from 'react';
//other
import { fileOptions as apiFileOptions } from '../api/fileOptions';
import { IFileOptions } from '../types';

interface IUseFileOptions {
  fetchFileOptions: () => Promise<void>;
  isLoadingFetchFileOptions: boolean;
  fileOptions: IFileOptions[];
  fileOptionsError: string | null;
}

export const useFileOptions = (): IUseFileOptions => {
  const [fileOptions, setFileOptions] = useState<IFileOptions[]>([]);
  const [isLoadingFetchFileOptions, setIsLoadingFetchFileOptions] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFileOptions = async () => {
    try {
      setIsLoadingFetchFileOptions(true);
      const { data } = await apiFileOptions.get();

      setFileOptions(data.options || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch file options');
    } finally {
      setIsLoadingFetchFileOptions(false);
    }
  };

  useEffect(() => {
    fetchFileOptions();
  }, []);

  return {
    isLoadingFetchFileOptions,
    fileOptionsError: error,
    fetchFileOptions,
    fileOptions,
  };
};
