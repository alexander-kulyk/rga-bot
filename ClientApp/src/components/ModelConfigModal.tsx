//core
import React, { useEffect, useMemo, useState } from 'react';
import {
  ClickAwayListener,
  Typography,
  Tooltip,
  Button,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
//components
import { SettingsButton } from './SettingsButton';
import { RangeController } from './Controllers';
//other
import { IModelConfigs } from '../types';

interface ModelConfigModalProps {
  modalConfigData?: IModelConfigs | null;
  onSettingsClick?: () => void;
  disabled?: boolean;
  updateModalConfig: (modalConfigData: IModelConfigs) => Promise<void>;
}

// Local form shape used by react-hook-form
interface IModelConfigForm {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export const ModelConfigModal: React.FC<ModelConfigModalProps> = ({
  modalConfigData,
  onSettingsClick,
  disabled = false,
  updateModalConfig,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const defaultValues = useMemo<IModelConfigForm>(
    () => ({
      model: modalConfigData?.model ?? '',
      temperature: modalConfigData?.temperature ?? 1,
      topP: modalConfigData?.top_p ?? 1,
      maxTokens: modalConfigData?.max_tokens ?? 1024,
    }),
    [modalConfigData]
  );

  const { control, reset, watch, getValues } = useForm<IModelConfigForm>({
    defaultValues,
    mode: 'onChange',
  });

  // Keep form in sync when modalConfigData updates
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleSettingsButtonClick = () => {
    setTooltipOpen((prev) => !prev);
    onSettingsClick?.();
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleApplyChanges = async () => {
    setSaving(true);
    const { model, temperature, topP, maxTokens } = getValues();

    const payload: IModelConfigs = {
      model,
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
    } as IModelConfigs;

    await updateModalConfig(payload);
    setTooltipOpen(false);
    setSaving(false);
  };

  const renderForm = () => (
    <Box
      sx={{
        padding: '12px',
        width: '250px',
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}
      >
        Model Configuration
      </Typography>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
        >
          Model:
        </Typography>
        <Typography variant='caption' sx={{ color: 'black' }}>
          {watch('model')}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Temperature
          </Typography>
        </Box>
        <RangeController
          control={control}
          name={'temperature'}
          minValue={0}
          maxValue={2}
          step={0.1}
          shiftStep={0.05}
          size='small'
          valueLabelDisplay='auto'
          defaultValue={defaultValues.temperature}
          disabled={disabled}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Top P
          </Typography>
        </Box>
        <RangeController
          control={control}
          name={'topP'}
          minValue={0}
          maxValue={1}
          step={0.05}
          shiftStep={0.01}
          size='small'
          valueLabelDisplay='auto'
          defaultValue={defaultValues.topP}
          disabled={disabled}
        />
      </Box>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Max Tokens
          </Typography>
        </Box>
        <RangeController
          control={control}
          name={'maxTokens'}
          minValue={128}
          maxValue={4096}
          step={16}
          shiftStep={64}
          size='small'
          valueLabelDisplay='auto'
          defaultValue={defaultValues.maxTokens}
          disabled={disabled}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button
          size='small'
          variant='contained'
          onClick={handleApplyChanges}
          disabled={disabled || saving}
        >
          {saving ? 'Applying...' : 'Apply changes'}
        </Button>
      </Box>
    </Box>
  );

  const formatModelConfigTooltip = () => {
    if (!modalConfigData) {
      return (
        <Box sx={{ padding: '12px', width: '350px' }}>
          <Typography variant='caption' sx={{ color: 'black' }}>
            No model configuration available
          </Typography>
        </Box>
      );
    }

    return renderForm();
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={formatModelConfigTooltip()}
        open={tooltipOpen}
        placement='top'
        arrow
        disableHoverListener
        disableFocusListener
        disableTouchListener
        PopperProps={{
          disablePortal: true,
        }}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: 'rgb(255, 255, 255)',
              maxWidth: '350px',
              fontSize: '0.75rem',
              color: 'black',
              boxShadow: 3,
            },
          },
          arrow: {
            sx: { color: 'rgb(255, 255, 255)' },
          },
        }}
      >
        <Box>
          <SettingsButton
            onClick={handleSettingsButtonClick}
            disabled={disabled}
            position='relative'
            size='small'
          />
        </Box>
      </Tooltip>
    </ClickAwayListener>
  );
};
