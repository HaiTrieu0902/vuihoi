import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Fade,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import DashboardLayout from '../components/DashboardLayout';
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
      <DashboardLayout>
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xs: '100%', sm: '1200px', md: '1400px', lg: '1600px' },
          }}
        >
          {/* Welcome Section */}
          <Fade in timeout={800}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3, md: 4 },
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                🎓 Welcome to VuiHoi AI
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  lineHeight: 1.5,
                }}
              >
                Your intelligent learning companion. Ask questions, explore AI technologies, and accelerate your
                knowledge journey.
              </Typography>
            </Paper>
          </Fade>

          {/* Feature Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
              mb: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {featureCards.map((card, index) => (
              <Fade in timeout={1000 + index * 200} key={card.path}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${card.gradient[0]} 0%, ${card.gradient[1]} 100%)`,
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    minHeight: { xs: 140, sm: 160, md: 180 },
                  }}
                >
                  <CardActionArea component={Link} to={card.path} sx={{ height: '100%', p: { xs: 2, sm: 2.5, md: 3 } }}>
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        p: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ fontSize: { xs: '2.5rem', sm: '2.8rem', md: '3rem' }, mb: { xs: 1.5, sm: 2 } }}>
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
                          lineHeight: 1.3,
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
          <Fade in timeout={1400}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  color: 'primary.main',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.7rem' },
                }}
              >
                ☀️ Trending Topics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 } }}>
                {trendingTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                      py: { xs: 0.25, sm: 0.5 },
                      px: { xs: 0.75, sm: 1 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>

          {/* Quick Chat */}
          <Fade in timeout={1600}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                }}
              >
                💬 Quick Start
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  alignItems: 'flex-end',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Ask me anything..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                    flex: 1,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">📎</InputAdornment>,
                  }}
                />
                <Button
                  component={Link}
                  to="/chat"
                  variant="contained"
                  size="large"
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    minWidth: { xs: '100%', sm: 'auto' },
                    mt: { xs: 1.5, sm: 0 },
                  }}
                >
                  Start Chat 🚀
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </DashboardLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
