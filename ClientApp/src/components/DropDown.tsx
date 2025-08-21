//core
import React from 'react';
import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
//other
import { IDropdownOption } from '../types';

export interface DropdownProps {
  onChange: (event: SelectChangeEvent<string>) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  options: IDropdownOption[];
  displayEmpty?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value: string;
  id?: string;
  sx?: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  displayEmpty = true,
  variant = 'outlined',
  disabled = false,
  fullWidth = true,
  size = 'small',
  placeholder,
  onChange,
  options,
  label,
  value,
  name,
  id,
  sx,
}) => {
  const labelId = id ? `${id}-label` : undefined;

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      variant={variant}
      sx={sx}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty={displayEmpty}
        inputProps={{ 'aria-label': label || name || id }}
      >
        {displayEmpty && placeholder && (
          <MenuItem value=''>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
