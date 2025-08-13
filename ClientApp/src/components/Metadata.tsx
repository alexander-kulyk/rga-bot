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
    const date = new Date(timestamp * 1000);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const formatModelName = (modelName: string) => {
    // Extract just the base model name (e.g., "gpt-4o" from "gpt-4o-2024-08-06")
    return modelName.split('-').slice(0, 2).join('-');
  };

  if (!metadata) return null;

  const { date, time } = formatTimestamp(metadata.created);

  const tooltipContent = (
    <TooltipContent>
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}
      >
        Response Metadata
      </Typography>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
        >
          Model:
        </Typography>
        <Typography variant='caption' sx={{ color: 'black' }}>
          {formatModelName(metadata.model)}
        </Typography>
      </Box>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
        >
          Created Date:
        </Typography>
        <Typography variant='caption' sx={{ color: 'black' }}>
          {date}
        </Typography>
      </Box>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant='caption'
          sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}
        >
          Created Time:
        </Typography>
        <Typography variant='caption' sx={{ color: 'black' }}>
          {time}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant='caption'
          sx={{
            fontWeight: 'bold',
            color: 'rgba(0,0,0,0.7)',
            display: 'block',
            mb: 0.5,
          }}
        >
          Token Usage:
        </Typography>
        <Typography variant='caption' sx={{ color: 'black', display: 'block' }}>
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
