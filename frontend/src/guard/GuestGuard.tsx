import { ReactNode, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Box, CircularProgress, Fade, Typography, Container } from '@mui/material';
import { useAuthStore } from '../store/auth';

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to dashboard/home if already authenticated
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading, router]);

  // Show beautiful loading screen while checking auth state
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: { xs: '100px', sm: '150px', md: '200px' },
            height: { xs: '100px', sm: '150px', md: '200px' },
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            opacity: 0.1,
            '@keyframes float1': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
            animation: 'float1 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: { xs: '80px', sm: '120px', md: '150px' },
            height: { xs: '80px', sm: '120px', md: '150px' },
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)',
            opacity: 0.08,
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(20px)' },
            },
            animation: 'float2 8s ease-in-out infinite',
          }}
        />

        <Container maxWidth="sm">
          <Fade in timeout={800}>
            <Box
              sx={{
                textAlign: 'center',
                padding: { xs: 3, sm: 4, md: 6 },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Logo/Brand */}
              <Box
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                🚀
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
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                }}
              >
                VuiHoi AI
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  opacity: 0.8,
                }}
              >
                Preparing your experience...
              </Typography>

              {/* Loading animation */}
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="primary"
                    sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    🔐
                  </Typography>
                </Box>
              </Box>

              {/* Progress dots */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.4, transform: 'scale(0.8)' },
                        '50%': { opacity: 1, transform: 'scale(1)' },
                      },
                      animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    );
  }

  // Don't render children if authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  // Render children if not authenticated (guest user)
  return <>{children}</>;
};

export default GuestGuard;
