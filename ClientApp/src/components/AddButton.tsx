//core
import React from 'react';
import { Fab } from '@mui/material';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
//other
import { ComponentSize } from '../types';

interface FloatingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'fixed' | 'relative';
}

const StyledFab = styled(Fab)<{ $variant: 'fixed' | 'relative' }>`
  ${(props) =>
    props.$variant === 'fixed'
      ? `
    position: fixed !important;
    bottom: 2rem;
    left: 2rem;
    z-index: 1000;
  `
      : `
    position: static !important;
  `}
  background-color: #ffffff !important;
  color: #666 !important;
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  box-shadow: none !important;
  border: 1px solid #ccc !important;
  border-radius: 10px !important;

  &:disabled {
    background-color: #cccccc !important;
    color: #999999 !important;
    box-shadow: none !important;
  }
`;

export const AddButton: React.FC<FloatingButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'fixed',
}) => {
  return (
    <StyledFab
      $variant={variant}
      size={ComponentSize.SMALL}
      onClick={onClick}
      disabled={disabled}
      aria-label='add file'
    >
      <AddIcon sx={{ fontSize: '16px' }} />
    </StyledFab>
  );
};
