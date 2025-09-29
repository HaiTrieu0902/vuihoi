import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f0f2f5',
      }}
    >
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <MainContent sidebarOpen={isSidebarOpen}>{children}</MainContent>
    </Box>
  );
};

export default MainLayout;
