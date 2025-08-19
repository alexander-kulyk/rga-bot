//core
import React, { useState } from 'react';
import {
  TextField as MuiTextField,
  CircularProgress,
  LinearProgress,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';
import { SettingsButton } from './SettingsButton';
import { FloatingButton } from './FloatingButton';
//other
import { IModelConfigs } from '../types';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  onFloatingButtonClick?: () => void;
  floatingButtonDisabled?: boolean;
  uploading?: boolean;
  onSettingsClick?: () => void;
  settingsDisabled?: boolean;
  modalConfigData?: IModelConfigs | null;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyPress,
  loading,
  disabled = false,
  placeholder = 'Type your question here...',
  label = 'Ask a question about the documentation',
  onFloatingButtonClick,
  floatingButtonDisabled = false,
  uploading = false,
  settingsDisabled = false,
  modalConfigData,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSettingsClick = () => {
    setTooltipOpen(true);
  };

  const formatModelConfigTooltip = () => {
    if (!modalConfigData) {
      return 'No model configuration available';
    }

    return (
      <Box>
        <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
          Model Configuration:
        </Typography>
        <Typography variant='body2'>Model: {modalConfigData.model}</Typography>
        <Typography variant='body2'>
          Temperature: {modalConfigData.temperature}
        </Typography>
        <Typography variant='body2'>Top P: {modalConfigData.top_p}</Typography>
        <Typography variant='body2'>
          Max Tokens: {modalConfigData.max_tokens}
        </Typography>
      </Box>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Create a synthetic form event for the button click
    const syntheticEvent = {
      preventDefault: () => {},
      currentTarget: e.currentTarget,
      target: e.target,
      type: 'submit',
      bubbles: true,
      cancelable: true,
      timeStamp: Date.now(),
      isTrusted: false,
    } as React.FormEvent;

    onSubmit(syntheticEvent);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box component='form' onSubmit={handleSubmit}>
        <MuiTextField
          fullWidth
          multiline
          rows={3}
          variant='outlined'
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={loading || disabled}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#ccc !important',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ccc !important',
                borderWidth: '1px !important',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc !important',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc !important',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc !important',
                borderWidth: '1px !important',
              },
              '& textarea': {
                '&:focus': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                },
              },
              '& input': {
                '&:focus': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666',
              fontFamily:
                'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              '&.Mui-focused': {
                color: '#666 !important',
              },
            },
            '& .MuiOutlinedInput-input': {
              fontFamily:
                'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            },
          }}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {loading && <CircularProgress size={20} />}
                <IconButton
                  type='submit'
                  disabled={loading || !value.trim()}
                  sx={{
                    color: '#666',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&:disabled': {
                      color: '#ccc',
                    },
                  }}
                  onClick={handleButtonClick}
                >
                  <Fingerprint />
                </IconButton>
              </Box>
            ),
          }}
        />
      </Box>

      {uploading && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
          }}
        >
          <LinearProgress
            sx={{
              height: '3px',
              borderRadius: '0 0 12px 12px',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50',
              },
              '& .MuiLinearProgress-root': {
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
              },
            }}
          />
        </Box>
      )}

      {onFloatingButtonClick && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            zIndex: 1,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <FloatingButton
            onClick={onFloatingButtonClick}
            disabled={floatingButtonDisabled}
            variant='relative'
          />
          <Tooltip
            title={formatModelConfigTooltip()}
            open={tooltipOpen}
            onClose={() => setTooltipOpen(false)}
            onOpen={() => setTooltipOpen(true)}
            placement='top'
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  fontSize: '0.75rem',
                  maxWidth: 280,
                  padding: '12px',
                },
              },
            }}
          >
            <SettingsButton
              onClick={handleSettingsClick}
              disabled={settingsDisabled}
              position='relative'
              size='small'
            />
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
