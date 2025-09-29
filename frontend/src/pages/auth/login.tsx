import { Box, Container, Fade, Paper, Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import GuestGuard from '../../guard/GuestGuard';

const LoginPage = () => {
  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements - optimized for different screen sizes */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '5%', md: '10%' },
            right: { xs: '5%', md: '15%' },
            width: { xs: '60px', sm: '100px', md: '150px', lg: '200px' },
            height: { xs: '60px', sm: '100px', md: '150px', lg: '200px' },
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            opacity: 0.08,
            '@keyframes float1': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-15px) rotate(180deg)' },
            },
            animation: 'float1 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '10%', md: '20%' },
            left: { xs: '5%', md: '10%' },
            width: { xs: '40px', sm: '80px', md: '120px', lg: '150px' },
            height: { xs: '40px', sm: '80px', md: '120px', lg: '150px' },
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)',
            opacity: 0.06,
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(20px) rotate(-180deg)' },
            },
            animation: 'float2 10s ease-in-out infinite',
          }}
        />

        <Container
          maxWidth="xs"
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px', md: '440px', lg: '480px' },
          }}
        >
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                padding: { xs: 4, sm: 5, md: 6 },
                borderRadius: { xs: 3, md: 4 },
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                }}
              />

              {/* Logo section - more compact */}
              <Box
                sx={{
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                �
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                VuiHoi AI
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  opacity: 0.8,
                  fontWeight: 400,
                }}
              >
                Welcome back! Please sign in to continue
              </Typography>

              <LoginForm />

              <Box
                sx={{
                  mt: { xs: 3, sm: 4 },
                  pt: { xs: 2, sm: 3 },
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    opacity: 0.7,
                  }}
                >
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
