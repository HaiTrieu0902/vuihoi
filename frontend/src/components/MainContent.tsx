import { Box, Toolbar } from '@mui/material';
import type { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
  sidebarOpen: boolean;
  drawerWidth?: any;
};

const MainContent = ({ children, sidebarOpen, drawerWidth }: MainContentProps) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: '#f0f2f5',
        minHeight: '100vh',
        ml: sidebarOpen ? '20px' : '80px',
        transition: 'margin-left 0.3s ease',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <Box
        sx={{
          p: 3,
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainContent;
