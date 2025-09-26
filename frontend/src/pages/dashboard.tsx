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
import { SmartToy, Psychology, History, Translate } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import DashboardLayout from '../components/DashboardLayout';
import AuthGuard from '../guard/AuthGuard';

const DashboardPage = () => {
  const theme = useTheme();

  const featureCards = [
    {
      title: 'AI Chat',
      description: 'Chat with intelligent AI',
      icon: <SmartToy sx={{ fontSize: '3rem' }} />,
      path: '/chat',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: 'Deep Learning',
      description: 'AI & Machine Learning',
      icon: <Psychology sx={{ fontSize: '3rem' }} />,
      path: '/deep_learning',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      title: 'History',
      description: 'View conversation history',
      icon: <History sx={{ fontSize: '3rem' }} />,
      path: '/history',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      title: 'Translate',
      description: 'AI-powered translation',
      icon: <Translate sx={{ fontSize: '3rem' }} />,
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
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Fade in timeout={800}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                🎓 Welcome to VuiHoi AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Your intelligent learning companion. Ask questions, explore AI technologies, and accelerate your
                knowledge journey.
              </Typography>
            </Paper>
          </Fade>

          {/* Feature Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 4,
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
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardActionArea component={Link} to={card.path} sx={{ height: '100%', p: 3 }}>
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Box sx={{ mb: 2 }}>{card.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
            <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                ☀️ Trending Topics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {trendingTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      fontSize: '0.9rem',
                      py: 0.5,
                      px: 1,
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
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                💬 Quick Start
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  placeholder="Ask me anything..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
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
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
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
