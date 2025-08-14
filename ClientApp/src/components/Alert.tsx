import React, { FC } from 'react';
import { Alert as MuiAlert } from '@mui/material';

interface AlertProps {
  error: string;
}

export const Alert: FC<AlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <MuiAlert severity='error' sx={{ margin: '1rem 0' }}>
      {error}
    </MuiAlert>
  );
};
