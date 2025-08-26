//core
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Control, FieldValues, Path } from 'react-hook-form';
//other
import { IDropdownOption, IFileOptions } from '../types';
import { DropdownController } from './Controllers';

interface IProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fileOptions: IFileOptions[];
  name: Path<TFieldValues>;
  text?: string;
}

export const Footer = <TFieldValues extends FieldValues>({
  text = 'Press Enter or click the send button to ask your question',
  fileOptions,
  control,
  name,
}: IProps<TFieldValues>) => {
  const getOptions = (): IDropdownOption[] =>
    fileOptions.map((option) => ({
      id: option._id,
      value: option.name,
      disabled: false,
    }));

  const options: IDropdownOption[] = useMemo(() => getOptions(), [fileOptions]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        sx={{
          marginTop: 2,
          fontFamily:
            'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        {text}
      </Typography>
      <div style={{ width: '200px', marginTop: '16px' }}>
        <DropdownController options={options} control={control} name={name} />
      </div>
    </div>
  );
};
