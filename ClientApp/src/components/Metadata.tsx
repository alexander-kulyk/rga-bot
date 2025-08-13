//core
import { Modal, Box, Typography, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import styled from 'styled-components';
import { FC, useState } from 'react';
//other
import { IAnswerModelMetadata } from '../types';

interface MetadataProps {
  metadata: IAnswerModelMetadata | null;
}

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 24px;
  outline: none;
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

export const Metadata: FC<MetadataProps> = ({ metadata }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!metadata) return null;

  return (
    <>
      <IconButton
        size='small'
        onClick={handleModalOpen}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          // backgroundColor: '#e3f2fd',
          color: '#d9e1f1',
          padding: '6px',
        }}
      >
        <InfoIcon fontSize='small' />
      </IconButton>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby='metadata-modal-title'
        aria-describedby='metadata-modal-description'
      >
        <ModalContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              id='metadata-modal-title'
              variant='h6'
              component='h2'
              sx={{ fontWeight: 'bold', color: '#333' }}
            >
              Response Metadata
            </Typography>
            <IconButton
              onClick={handleModalClose}
              sx={{ color: '#666', padding: '4px' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box id='metadata-modal-description'>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}
              >
                Request ID:
              </Typography>
              <Chip
                label={metadata.id}
                size='small'
                sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}
              >
                Model:
              </Typography>
              <Chip
                label={metadata.model}
                size='small'
                color='primary'
                variant='outlined'
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}
              >
                Created:
              </Typography>
              <Typography variant='body2' sx={{ color: '#666' }}>
                {formatTimestamp(metadata.created)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 'bold', color: '#555', mb: 1 }}
              >
                Token Usage:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Prompt tokens:</Typography>
                  <Chip
                    label={metadata.usage.prompt_tokens}
                    size='small'
                    sx={{ minWidth: '50px' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Completion tokens:</Typography>
                  <Chip
                    label={metadata.usage.completion_tokens}
                    size='small'
                    sx={{ minWidth: '50px' }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    pt: 1,
                    borderTop: '1px solid #eee',
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                    Total tokens:
                  </Typography>
                  <Chip
                    label={metadata.usage.total_tokens}
                    size='small'
                    color='secondary'
                    sx={{ minWidth: '50px', fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
