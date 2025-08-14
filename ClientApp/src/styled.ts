import styled from 'styled-components';
import { Paper } from '@mui/material';

export const StyledContainer = styled.div`
  padding: 2rem 0;
  min-height: 100vh;
  width: 100%;
  background: #f5f5f0;
  display: flex;
  justify-content: center;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  padding: 0 1rem;
`;

export const StyledPaper = styled(Paper)`
  padding: 2rem;
  margin: 1rem 0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;
