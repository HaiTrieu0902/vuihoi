import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: '🏠',
    },
    {
      name: 'AI Chat',
      path: '/chat',
      icon: '🤖',
    },
    {
      name: 'Deep Learning',
      path: '/deep_learning',
      icon: '🧠',
    },
    {
      name: 'History',
      path: '/history',
      icon: '📚',
    },
    {
      name: 'Translate',
      path: '/translate',
      icon: '🌐',
    },
  ];

  const currentPath = location.pathname;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      sx={{
        width: isOpen ? 200 : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isOpen ? 220 : 80,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          borderRight: '1px solid #f0f0f0',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />

      {/* Menu Section */}
      {isOpen && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#00000073',
              fontSize: '12px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1,
            }}
          >
            MENU
          </Typography>
        </Box>
      )}

      {/* Navigation */}
      <List>
        {navigationItems.map((item) => {
          const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  mx: 1,
                  borderRadius: '6px',
                  bgcolor: isActive ? '#F4F4F4' : 'transparent',
                  color: isActive ? '#000000' : '#00000073',
                  '&:hover': {
                    bgcolor: isActive ? '#F4F4F4' : '#f9f9f9',
                    color: isActive ? '000000' : '#000000d9',
                  },
                  height: 38,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isOpen ? 32 : 'auto',
                    color: 'inherit',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Others Section */}
      {isOpen && (
        <Box sx={{ px: 2, py: 2, mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#00000073',
              fontSize: '12px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1,
            }}
          >
            OTHERS
          </Typography>
          <List sx={{ p: 0 }}>
            {[
              { name: 'Settings', icon: '⚙️' },
              { name: 'Help', icon: '❓' },
            ].map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: '6px',
                    color: '#00000073',
                    '&:hover': {
                      bgcolor: '#f9f9f9',
                      color: '#000000d9',
                    },
                    height: 38,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: 'inherit',
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
