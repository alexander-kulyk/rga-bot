//core
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
//other
import { IDropdownOption } from '../../../types';

export interface DropdownControllerProps<TFieldValues extends FieldValues> {
  variant?: 'outlined' | 'filled' | 'standard';
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: IDropdownOption[];
  size?: 'small' | 'medium';
  displayEmpty?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
  sx?: any;
}

export const DropdownController = <TFieldValues extends FieldValues>({
  variant = 'outlined',
  displayEmpty = true,
  disabled = false,
  fullWidth = true,
  size = 'small',
  placeholder,
  options,
  control,
  name,
  label,
  id,
  sx,
}: DropdownControllerProps<TFieldValues>) => {
  const labelId = id ? `${id}-label` : undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
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
            value={(field.value as string) ?? ''}
            onChange={(e) =>
              field.onChange((e as SelectChangeEvent<string>).target.value)
            }
            label={label}
            displayEmpty={displayEmpty}
            inputProps={{ 'aria-label': label || id || (name as string) }}
            MenuProps={{ disablePortal: true }}
          >
            {displayEmpty && placeholder && (
              <MenuItem value=''>
                <em>{placeholder}</em>
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem
                key={option.id}
                value={option.value}
                disabled={option.disabled}
              >
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
