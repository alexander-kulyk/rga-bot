//core
import React, { useState } from 'react';
//components
import {
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  Paper,
  Alert,
  Box,
  Modal,
  Chip,
} from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
//hooks
import { useModelAsk } from './hooks';
//other
import './App.css';

// Styled components
const StyledContainer = styled.div`
  padding: 2rem 0;
  min-height: 100vh;
  width: 100%;
  background: #f5f5f0;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  padding: 0 1rem;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  margin: 1rem 0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

const ResponseContainer = styled(Box)`
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #e3e3e3;
  position: relative;
`;

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

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    handleKeyPress,
    handleSubmit,
    setQuestion,
    answerText,
    question,
    loading,
    error,
    answerModelMetadata,
  } = useModelAsk();

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <StyledContainer>
      <ContentWrapper>
        <StyledPaper elevation={3}>
          {/* <header>
            <Typography
              variant='h3'
              component='h1'
              align='center'
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 3,
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              RAG Bot – Document FAQ
            </Typography>
          </header> */}

          {/* Response Display Area */}
          {answerText && (
            <ResponseContainer>
              {answerModelMetadata && (
                <IconButton
                  size='small'
                  onClick={handleModalOpen}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#d9e1f1',
                    padding: '4px',
                    // '&:hover': {
                    //   backgroundColor: '#bcc2ce',
                    //   color: '#666',
                    // },
                  }}
                >
                  <InfoIcon fontSize='small' />
                </IconButton>
              )}
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  color: '#aeabab',
                }}
              >
                Answer:
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily:
                    'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                }}
              >
                {answerText}
              </Typography>
            </ResponseContainer>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity='error' sx={{ margin: '1rem 0' }}>
              {error}
            </Alert>
          )}

          {/* Input Form */}
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant='outlined'
              label='Ask a question about the documentation'
              placeholder='Type your question here...'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
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
                      disabled={loading || !question.trim()}
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
                      onClick={handleSubmit}
                    >
                      <Fingerprint />
                    </IconButton>
                  </Box>
                ),
              }}
            />
          </Box>

          {/* Instructions */}
          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            sx={{
              marginTop: 2,
              fontFamily:
                'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            }}
          >
            Press Enter or click the send button to ask your question
          </Typography>
        </StyledPaper>

        {/* Metadata Modal */}
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

            {answerModelMetadata && (
              <Box id='metadata-modal-description'>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant='subtitle2'
                    sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}
                  >
                    Request ID:
                  </Typography>
                  <Chip
                    label={answerModelMetadata.id}
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
                    label={answerModelMetadata.model}
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
                    {formatTimestamp(answerModelMetadata.created)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant='subtitle2'
                    sx={{ fontWeight: 'bold', color: '#555', mb: 1 }}
                  >
                    Token Usage:
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant='body2'>Prompt tokens:</Typography>
                      <Chip
                        label={answerModelMetadata.usage.prompt_tokens}
                        size='small'
                        sx={{ minWidth: '50px' }}
                      />
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant='body2'>
                        Completion tokens:
                      </Typography>
                      <Chip
                        label={answerModelMetadata.usage.completion_tokens}
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
                        label={answerModelMetadata.usage.total_tokens}
                        size='small'
                        color='secondary'
                        sx={{ minWidth: '50px', fontWeight: 'bold' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </ModalContent>
        </Modal>
      </ContentWrapper>
    </StyledContainer>
  );
}

export default App;
