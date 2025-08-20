//core
import React, { useState } from 'react';
import { Typography, Tooltip, Box, ClickAwayListener } from '@mui/material';
import { SettingsButton } from './SettingsButton';
//other
import { IModelConfigs } from '../types';

interface ModelConfigModalProps {
  modalConfigData?: IModelConfigs | null;
  onSettingsClick?: () => void;
  disabled?: boolean;
}

export const ModelConfigModal: React.FC<ModelConfigModalProps> = ({
  modalConfigData,
  onSettingsClick,
  disabled = false,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleSettingsButtonClick = () => {
    setTooltipOpen(!tooltipOpen);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const formatModelConfigTooltip = () => {
    if (!modalConfigData) {
      return (
        <Box
          sx={{
            padding: '12px',
            maxWidth: '300px',
            fontFamily:
              'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
          }}
        >
          <Typography variant='caption' sx={{ color: 'black' }}>
            No model configuration available
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          padding: '12px',
          maxWidth: '300px',
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
            {modalConfigData.model}
          </Typography>
        </Box>

        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Temperature:
          </Typography>
          <Typography variant='caption' sx={{ color: 'black' }}>
            {modalConfigData.temperature}
          </Typography>
        </Box>

        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Top P:
          </Typography>
          <Typography variant='caption' sx={{ color: 'black' }}>
            {modalConfigData.top_p}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant='caption'
            sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
          >
            Max Tokens:
          </Typography>
          <Typography variant='caption' sx={{ color: 'black' }}>
            {modalConfigData.max_tokens}
          </Typography>
        </Box>
      </Box>
    );
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
              maxWidth: 'none',
              fontSize: '0.75rem',
              color: 'black',
              boxShadow: 3,
            },
          },
          arrow: {
            sx: {
              color: 'rgb(255, 255, 255)',
            },
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
