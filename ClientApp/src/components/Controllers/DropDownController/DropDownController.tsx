//core
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import Select from 'react-select';
//other
import { IDropdownOption, ComponentSize } from '../../../types';

export interface DropdownControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: IDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  size?: ComponentSize;
}

export const DropdownController = <TFieldValues extends FieldValues>({
  isClearable = false,
  isSearchable = true,
  disabled = false,
  size = ComponentSize.SMALL,
  placeholder,
  options,
  control,
  name,
  label,
}: DropdownControllerProps<TFieldValues>) => {
  const selectOptions = options.map((option) => ({
    value: option.value,
    label: option.value,
    isDisabled: option.disabled,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: size === ComponentSize.SMALL ? '40px' : '56px',
      fontSize: size === ComponentSize.SMALL ? '14px' : '16px',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: size === ComponentSize.SMALL ? '2px 8px' : '8px 14px',
    }),
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            options={selectOptions}
            placeholder={placeholder}
            isDisabled={disabled}
            isClearable={isClearable}
            isSearchable={isSearchable}
            styles={customStyles}
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : '');
            }}
            value={
              selectOptions.find((option) => option.value === field.value) ||
              null
            }
          />
        )}
      />
    </div>
  );
};
