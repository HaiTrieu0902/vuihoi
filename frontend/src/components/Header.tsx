import { AppBar, Avatar, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, actions } = useAuthStore();
  const router = useRouter();
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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        color: '#000000d9',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        <IconButton
          aria-label="toggle drawer"
          onClick={onToggleSidebar}
          edge="start"
          sx={{
            mr: 2,
            color: '#00000073',
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <Box sx={{ fontSize: '18px' }}>☰</Box>
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000d9',
          }}
        >
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#00000073', display: { xs: 'none', sm: 'block' } }}>
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </Typography>

          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{
              p: 0,
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#1890ff',
                color: 'white',
                width: 32,
                height: 32,
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 160,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '6px',
            },
          }}
        >
          <MenuItem disabled sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#00000073' }}>
                Signed in as
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#000000d9', fontSize: '14px' }}>
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              fontSize: '14px',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
