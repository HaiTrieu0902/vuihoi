import { Box, Button, Card, CardActionArea, CardContent, Chip, Fade, InputAdornment, Paper, TextField, Typography, alpha, useTheme } from '@mui/material';
import { Link } from '@tanstack/react-router';
import MainLayout from '../components/MainLayout';
import AuthGuard from '../guard/AuthGuard';

const DashboardPage = () => {
  const theme = useTheme();

  const featureCards = [
    {
      title: 'AI Chat',
      description: 'Chat with intelligent AI',
      icon: '🤖',
      path: '/chat',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: 'Deep Learning',
      description: 'AI & Machine Learning',
      icon: '🧠',
      path: '/deep_learning',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      title: 'History',
      description: 'View conversation history',
      icon: '📚',
      path: '/history',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      title: 'Translate',
      description: 'AI-powered translation',
      icon: '🌐',
      path: '/translate',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const trendingTopics = [
    'AI Technology',
    'Machine Learning',
    'Data Science',
    'Natural Language',
    'Computer Vision',
    'Deep Learning',
    'Neural Networks',
    'Automation',
    'Innovation',
    'Future Tech',
  ];

  return (
    <AuthGuard>
      <MainLayout>
        <Box sx={{ position: 'relative' }}>
          {/* Welcome Hero Section */}
          <Fade in timeout={600}>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                mb: { xs: 3, sm: 4, md: 6 },
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  opacity: 0.05,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
                  opacity: 0.05,
                }}
              />

              <Box sx={{ p: { xs: 4, sm: 5, md: 6 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      mr: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🚀
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Welcome to VuiHoi AI
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: '#4a5568',
                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem' },
                    fontWeight: 500,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Your intelligent learning companion. Explore AI technologies, get instant answers, and accelerate your knowledge journey with cutting-edge artificial
                  intelligence.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Box sx={{ fontSize: '1rem' }}>⚡</Box>}
                    label="Instant AI Responses"
                    variant="outlined"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 500,
                      '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.05)' },
                    }}
                  />
                  <Chip
                    icon={<Box sx={{ fontSize: '1rem' }}>🧠</Box>}
                    label="Deep Learning Insights"
                    variant="outlined"
                    sx={{
                      borderColor: '#f093fb',
                      color: '#f093fb',
                      fontWeight: 500,
                      '&:hover': { backgroundColor: 'rgba(240, 147, 251, 0.05)' },
                    }}
                  />
                  <Chip
                    icon={<Box sx={{ fontSize: '1rem' }}>🌐</Box>}
                    label="Multi-language Support"
                    variant="outlined"
                    sx={{
                      borderColor: '#43e97b',
                      color: '#49c97b',
                      fontWeight: 500,
                      '&:hover': { backgroundColor: 'rgba(67, 233, 123, 0.05)' },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Feature Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 3, sm: 4, md: 4 },
              mb: { xs: 4, sm: 5, md: 6 },
            }}
          >
            {featureCards.map((card, index) => (
              <Fade in timeout={800 + index * 150} key={card.path}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                      '& .gradient-overlay': {
                        opacity: 1,
                      },
                    },
                    minHeight: { xs: 200, sm: 220, md: 240 },
                  }}
                >
                  {/* Gradient overlay that appears on hover */}
                  <Box
                    className="gradient-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${card.gradient[0]} 0%, ${card.gradient[1]} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      zIndex: 1,
                    }}
                  />

                  <CardActionArea
                    component={Link}
                    to={card.path}
                    sx={{
                      height: '100%',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        p: { xs: 3, sm: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                          mb: 2,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                          color: '#2d3748',
                          '.gradient-overlay:hover ~ * &': {
                            color: 'white',
                          },
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4a5568',
                          fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Fade>
            ))}
          </Box>

          {/* Trending Topics */}
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                mb: { xs: 4, sm: 5, md: 6 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative gradient line */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #43e97b)',
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ fontSize: '2rem', mr: 2 }}>🔥</Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem' },
                  }}
                >
                  Trending Topics
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {trendingTopics.map((topic, index) => (
                  <Chip
                    key={topic}
                    label={topic}
                    variant="outlined"
                    sx={{
                      borderRadius: 8,
                      fontSize: { xs: '0.8rem', sm: '0.8rem', md: '0.8rem' },
                      py: 2,
                      px: 2,
                      fontWeight: 500,
                      borderColor: 'rgba(102, 126, 234, 0.2)',
                      color: '#4a5568',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>

          {/* Quick Start Section */}
          <Fade in timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  opacity: 0.1,
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ fontSize: '2rem', mr: 2 }}>🚀</Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem' },
                  }}
                >
                  Quick Start
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#4a5568',
                  mb: 4,
                  fontSize: { xs: '0.9rem', sm: '0.9rem', md: '0.9rem' },
                  fontWeight: 500,
                }}
              >
                Jump right into a conversation or explore our AI-powered features
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3 },
                  alignItems: 'stretch',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Ask me anything about AI, programming, or any topic..."
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      // py: { xs: 0.5, sm: 1 },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
                />
                <Button
                  component={Link}
                  to="/chat"
                  variant="contained"
                  size="large"
                  sx={{
                    // px: { xs: 1, sm: 2 },
                    // py: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 400,
                    fontSize: { xs: '0.9rem', sm: '0.9rem', md: '0.9rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    minWidth: { xs: '100%', md: 'auto' },
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px) scale(1.02)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Start Conversation
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
