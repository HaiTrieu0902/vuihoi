import { Avatar, Box, Container, Fade, Paper, Typography } from '@mui/material';
// Using a simple lock icon for now since @mui/icons-material might need installation
import LoginForm from '../../components/auth/LoginForm';
import GuestGuard from '../../guard/GuestGuard';

const LoginPage = () => {
  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                padding: 6,
                borderRadius: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Avatar
                sx={{
                  margin: '0 auto 2rem',
                  backgroundColor: 'primary.main',
                  width: 60,
                  height: 60,
                  fontSize: '2rem',
                }}
              >
                🔐
              </Avatar>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 1,
                }}
              >
                VuiHoi AI
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
                Welcome back! Please sign in to continue
              </Typography>

              <LoginForm />

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  {/* Secure login powered by Microsoft Azure */}
                  All rights reserved. Designed by HaiTrieu.
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </GuestGuard>
  );
};

export default LoginPage;
