import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Link, useLocation, useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';

type DashboardLayoutProps = {
  children: ReactNode;
};

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
      icon: '🤖',
      description: 'Chat with intelligent AI',
    },
    {
      name: 'Deep Learning',
      path: '/deep_learning',
      icon: '🧠',
      description: 'AI & Machine Learning',
    },
    {
      name: 'History',
      path: '/history',
      icon: '📚',
      description: 'View conversation history',
    },
    {
      name: 'Translate',
      path: '/translate',
      icon: '🌐',
      description: 'AI-powered translation',
    },
  ];

  const currentPath = location.pathname;
  const drawerWidth = isSidebarOpen ? { xs: 240, sm: 260, md: 280 } : { xs: 60, sm: 68, md: 72 };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: '#fff',
          color: '#222',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 4 } }}>
          <IconButton
            aria-label="toggle drawer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            edge="start"
            sx={{ mr: { xs: 1, sm: 2 }, color: '#888' }}
          >
            ☰
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              color: '#222',
              fontWeight: 600,
            }}
          >
            VuiHoi AI Platform
          </Typography>

          <Chip
            avatar={<Avatar sx={{ bgcolor: '#f3f4f6', color: '#222', width: 24, height: 24 }}>👋</Avatar>}
            label={`Hello, ${user?.name || user?.email || 'User'}!`}
            variant="outlined"
            sx={{
              color: '#222',
              borderColor: '#e5e7eb',
              mr: 2,
              background: '#f9fafb',
              display: { xs: 'none', sm: 'flex' },
              '& .MuiChip-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
          />

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, color: '#888' }}
          >
            <Avatar
              sx={{
                bgcolor: '#f3f4f6',
                color: '#222',
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                fontWeight: 600,
              }}
            >
              {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
          width: isSidebarOpen ? drawerWidth.xs : drawerWidth.xs,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? drawerWidth.xs : drawerWidth.xs,
            boxSizing: 'border-box',
            background: '#f9fafb',
            borderRight: '1px solid #e5e7eb',
            transition: 'width 0.3s ease',
            [theme.breakpoints.up('sm')]: {
              width: isSidebarOpen ? drawerWidth.sm : drawerWidth.sm,
            },
            [theme.breakpoints.up('md')]: {
              width: isSidebarOpen ? drawerWidth.md : drawerWidth.md,
            },
          },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        {/* Brand Section */}
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 1.75, md: 2 },
              background: '#fff',
              color: '#222',
              borderRadius: 3,
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: '#222',
              }}
            >
              {isSidebarOpen ? 'VuiHoi AI' : '🎓'}
            </Typography>
            {isSidebarOpen && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  color: '#555',
                }}
              >
                Intelligent Learning Platform
              </Typography>
            )}
          </Paper>
        </Box>
        <Divider />
        {/* Navigation */}
        <List sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: { xs: 0.5, sm: 1 } }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    minHeight: { xs: 48, sm: 52, md: 56 },
                    backgroundColor: isActive ? '#e0e7ef' : 'transparent',
                    color: isActive ? '#2563eb' : '#222',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                    ...(isActive && {
                      borderLeft: '4px solid #2563eb',
                      fontWeight: 600,
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: isSidebarOpen ? { xs: 48, sm: 52, md: 56 } : 'auto',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText
                      primary={item.name}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                        color: isActive ? '#2563eb' : '#222',
                      }}
                      secondaryTypographyProps={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        color: '#555',
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
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
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
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: `${drawerWidth.xs}px`, sm: `${drawerWidth.sm}px`, md: `${drawerWidth.md}px` },
          width: {
            xs: `calc(100% - ${drawerWidth.xs}px)`,
            sm: `calc(100% - ${drawerWidth.sm}px)`,
            md: `calc(100% - ${drawerWidth.md}px)`,
          },
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              background: '#fff',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
            }}
          >
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
