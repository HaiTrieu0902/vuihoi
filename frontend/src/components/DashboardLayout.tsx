import { useState } from 'react';
import { Link, useLocation, useRouter } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import type { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider,
  Menu,
  MenuItem,
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { SmartToy, Psychology, History, Translate } from '@mui/icons-material';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, actions } = useAuthStore();
  const location = useLocation();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleLogout = () => {
    actions.logout();
    router.navigate({ to: '/auth/login' });
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    {
      name: 'AI Chat',
      path: '/chat',
      icon: <SmartToy sx={{ fontSize: '1.5rem' }} />,
      description: 'Chat with intelligent AI',
    },
    {
      name: 'Deep Learning',
      path: '/deep_learning',
      icon: <Psychology sx={{ fontSize: '1.5rem' }} />,
      description: 'AI & Machine Learning',
    },
    {
      name: 'History',
      path: '/history',
      icon: <History sx={{ fontSize: '1.5rem' }} />,
      description: 'View conversation history',
    },
    {
      name: 'Translate',
      path: '/translate',
      icon: <Translate sx={{ fontSize: '1.5rem' }} />,
      description: 'AI-powered translation',
    },
  ];

  const currentPath = location.pathname;
  const drawerWidth = isSidebarOpen ? 280 : 72;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            edge="start"
            sx={{ mr: 2 }}
          >
            ☰
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            VuiHoi AI Platform
          </Typography>

          <Chip
            avatar={<Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>👋</Avatar>}
            label={`Hello, ${user?.name || user?.email || 'User'}!`}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              mr: 2,
            }}
          />

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 36,
                height: 36,
              }}
            >
              {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              🚪 Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Toolbar />

        {/* Brand Section */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {isSidebarOpen ? 'VuiHoi AI' : '🎓'}
            </Typography>
            {isSidebarOpen && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Intelligent Learning Platform
              </Typography>
            )}
          </Paper>
        </Box>

        <Divider />

        {/* Navigation */}
        <List sx={{ px: 2, py: 1 }}>
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    minHeight: 56,
                    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                    ...(isActive && {
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: isSidebarOpen ? 56 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText
                      primary={item.name}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 'bold' : 'medium',
                        fontSize: '0.95rem',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Bottom User Info (when collapsed) */}
        {!isSidebarOpen && (
          <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
                mx: 'auto',
              }}
            >
              {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
            </Avatar>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
