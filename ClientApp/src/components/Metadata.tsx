//core
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import styled from 'styled-components';
import { FC } from 'react';
//other
import { IAnswerModelMetadata } from '../types';

interface MetadataProps {
  metadata: IAnswerModelMetadata | null;
}

const TooltipContent = styled(Box)`
  padding: 12px;
  max-width: 300px;
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

export const Metadata: FC<MetadataProps> = ({ metadata }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!metadata) return null;

  const tooltipContent = (
    <TooltipContent>
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}
      >
        Response Metadata
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}
        >
          Model:
        </Typography>
        <Typography variant='caption' sx={{ color: 'white' }}>
          {metadata.model}
        </Typography>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}
        >
          Created:
        </Typography>
        <Typography variant='caption' sx={{ color: 'white' }}>
          {formatTimestamp(metadata.created)}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant='caption'
          sx={{
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.8)',
            display: 'block',
            mb: 0.5,
          }}
        >
          Token Usage:
        </Typography>
        <Typography variant='caption' sx={{ color: 'white', display: 'block' }}>
          Prompt: {metadata.usage.prompt_tokens} | Completion:{' '}
          {metadata.usage.completion_tokens} | Total:{' '}
          {metadata.usage.total_tokens}
        </Typography>
      </Box>
    </TooltipContent>
  );

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement='left'
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          maxWidth: 'none',
          fontSize: '0.75rem',
        },
        '& .MuiTooltip-arrow': {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <IconButton
        size='small'
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          color: '#d9e1f1',
          padding: '6px',
        }}
      >
        <InfoIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  );
};
