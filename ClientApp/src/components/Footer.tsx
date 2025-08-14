import React from 'react';
import { Typography } from '@mui/material';

interface FooterProps {
  text?: string;
}

export const Footer: React.FC<FooterProps> = ({
  text = 'Press Enter or click the send button to ask your question',
}) => {
  return (
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
      {text}
    </Typography>
  );
};
