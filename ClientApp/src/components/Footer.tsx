//core
import React, { useMemo } from 'react';
import { Typography, Tooltip } from '@mui/material';
import { Control, FieldValues, Path } from 'react-hook-form';
//other
import { IDropdownOption, IFileOptions } from '../types';
import { DropdownController } from './Controllers';

interface IProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  isTextFieldFocused?: boolean;
  fileOptions: IFileOptions[];
  name: Path<TFieldValues>;
  selectedValue?: string;
  text?: string;
}

export const Footer = <TFieldValues extends FieldValues>({
  text = 'Powered by AI',
  isTextFieldFocused = false,
  selectedValue = '',
  fileOptions,
  control,
  name,
}: IProps<TFieldValues>) => {
  const options: IDropdownOption[] = useMemo(
    () =>
      fileOptions.map((option) => ({
        id: option._id,
        value: option.name,
        disabled: false,
      })),
    [fileOptions]
  );

  const hasError = isTextFieldFocused && !selectedValue;

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
        <Tooltip
          title="Don't forget to select a document"
          open={hasError}
          placement='top'
          arrow
        >
          <div>
            <DropdownController
              options={options}
              control={control}
              name={name}
              hasError={hasError}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
