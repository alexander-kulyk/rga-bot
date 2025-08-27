//core
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
//other
import { IFileOptions } from '../types';
import { useFileOptions } from './';

interface IFileOptionForm {
  fileName: string;
}

export const useFileOptionForm = () => {
  const { fileOptions } = useFileOptions();

  const defaultValues = useMemo(
    () => ({
      fileName:
        fileOptions.find((file: IFileOptions) => file.isDefault)?.name ?? '',
    }),
    [fileOptions]
  );

  const { control, watch } = useForm<IFileOptionForm>({
    defaultValues,
    mode: 'all',
  });

  const selectedFileOption = watch('fileName');

  return {
    control,
    defaultValues,
    selectedFileOption,
  };
};
