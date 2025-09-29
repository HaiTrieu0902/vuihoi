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

  const drawerWidth = isSidebarOpen ? { xs: 280, sm: 320, md: 360 } : { xs: 72, sm: 76, md: 80 };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: { xs: '150px', md: '250px', lg: '350px' },
          height: { xs: '150px', md: '250px', lg: '350px' },
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          opacity: 0.03,
          '@keyframes float1': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(180deg)' },
          },
          animation: 'float1 20s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: { xs: '100px', md: '180px', lg: '280px' },
          height: { xs: '100px', md: '180px', lg: '280px' },
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
          opacity: 0.02,
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(40px) rotate(-180deg)' },
          },
          animation: 'float2 25s ease-in-out infinite',
        }}
      />

      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} drawerWidth={drawerWidth} />
      <MainContent drawerWidth={drawerWidth}>{children}</MainContent>
    </Box>
  );
};

export default MainLayout;
