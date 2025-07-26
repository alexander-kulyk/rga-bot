//core
import { useState } from 'react';
import axios from 'axios';
//components
import {
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  Paper,
  Alert,
  Box,
} from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';
import styled from 'styled-components';
//other
import './App.css';

interface ApiResponse {
  answer?: string;
  error?: string;
}

interface Question {
  question: string;
}

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
`;

function App() {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const payload: Question = { question: question.trim() };
      const result = await axios.post<ApiResponse>(
        'https://rga-bot-backend.onrender.com/api/ask',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (result.data.answer) {
        setResponse(result.data.answer);
      } else if (result.data.error) {
        setError(result.data.error);
      } else {
        setError('No response received');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || 'Failed to get response'
        );
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error asking question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
          {response && (
            <ResponseContainer>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  color: '#aeabab;',
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
                {response}
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
      </ContentWrapper>
    </StyledContainer>
  );
}

export default App;
