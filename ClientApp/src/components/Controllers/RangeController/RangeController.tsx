//core
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import React, { useMemo, useState, useCallback } from 'react';
import { Slider, SliderProps } from '@mui/material';

export interface RangeControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  maxValue?: number;
  minValue?: number;
  size?: 'small' | 'medium';
  defaultValue?: number | number[];
  shiftStep?: number;
  step?: number | null;
  valueLabelDisplay?: SliderProps['valueLabelDisplay'];
  disabled?: boolean;
  value?: number | number[];
  onChange?: (
    event: Event | React.SyntheticEvent,
    value: number | number[]
  ) => void;
  marks?: SliderProps['marks'];
  minDistance?: number;
}

export const RangeController = <TFieldValues extends FieldValues>({
  valueLabelDisplay = 'auto',
  onChange: onChangeProp,
  disabled = false,
  value: valueProp,
  size = 'medium',
  defaultValue,
  minDistance,
  shiftStep,
  step = 1,
  maxValue,
  minValue,
  control,
  name,
  marks,
}: RangeControllerProps<TFieldValues>) => {
  const [currentStep, setCurrentStep] = useState<number | null>(step);

  const handleKeyDown: SliderProps['onKeyDown'] = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement> | React.KeyboardEvent) => {
      if ('shiftKey' in e && (e as React.KeyboardEvent).shiftKey) {
        if (typeof shiftStep === 'number') setCurrentStep(shiftStep);
      }
    },
    [shiftStep]
  );

  const handleKeyUp: SliderProps['onKeyUp'] = useCallback(() => {
    setCurrentStep(step);
  }, [step]);

  const commonProps = useMemo<Partial<SliderProps>>(
    () => ({
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      valueLabelDisplay,
      step: currentStep,
      min: minValue,
      max: maxValue,
      minDistance,
      disabled,
      size,
      marks,
    }),
    [
      valueLabelDisplay,
      handleKeyDown,
      currentStep,
      handleKeyUp,
      minDistance,
      minValue,
      maxValue,
      disabled,
      size,
      marks,
    ]
  );

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue as any}
      render={({ field }) => (
        <Slider
          {...commonProps}
          value={
            valueProp !== undefined ? (valueProp as any) : (field.value as any)
          }
          onChange={(event, value) => {
            field.onChange(value);
            onChangeProp?.(event, value as number | number[]);
          }}
          // onChangeCommitted={(event, value) => {
          //   field.onBlur();
          // }}
        />
      )}
    />
  );
};
