import React from 'react';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import styled from 'styled-components';

interface SettingsButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'fixed' | 'relative';
}

const StyledIconButton = styled(IconButton)<{
  $position: 'fixed' | 'relative';
}>`
  ${(props) =>
    props.$position === 'fixed'
      ? `
    position: fixed !important;
    top: 2rem;
    right: 2rem;
    z-index: 1000;
  `
      : `
    position: relative !important;
  `}
  background-color: rgba(255, 255, 255, 0.9) !important;
  color: #666 !important;
  /* border: 1px solid #ccc !important;
  border-radius: 8px !important; */

  &:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    color: #333 !important;
    transform: rotate(45deg);
    transition: all 0.3s ease-in-out;
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05) !important;
    color: #ccc !important;
  }
`;

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  onClick,
  disabled = false,
  size = 'medium',
  position = 'fixed',
}) => {
  return (
    <StyledIconButton
      $position={position}
      size={size}
      onClick={onClick}
      disabled={disabled}
      aria-label='settings'
    >
      <SettingsIcon />
    </StyledIconButton>
  );
};
