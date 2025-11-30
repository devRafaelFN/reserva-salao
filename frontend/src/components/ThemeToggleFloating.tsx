import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleFloatingProps {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ThemeToggleFloating = ({ toggleColorMode, mode }: ThemeToggleFloatingProps) => {
  return (
    <Tooltip title={`Alternar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'background.paper',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleFloating;
