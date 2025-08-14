import React from 'react';
import { Typography, Box } from '@mui/material';
import styled from 'styled-components';
import { Metadata } from './Metadata';
import { IAnswerModelMetadata } from '../types';

interface ResponseContainerProps {
  answerText: string;
  answerModelMetadata: IAnswerModelMetadata | null;
}

const StyledResponseContainer = styled(Box)`
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #e3e3e3;
  position: relative;
`;

export const ResponseContainer: React.FC<ResponseContainerProps> = ({
  answerText,
  answerModelMetadata,
}) => {
  if (!answerText) {
    return null;
  }

  return (
    <StyledResponseContainer>
      <Metadata metadata={answerModelMetadata} />
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
    </StyledResponseContainer>
  );
};
