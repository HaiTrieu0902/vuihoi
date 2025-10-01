import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Paper,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import AuthGuard from '../../guard/AuthGuard';
import { ResearchService, ResearchStreamEvent } from '../../services/api/research';

const DeepLearningPage = () => {
  const theme = useTheme();
  const [researchDialog, setResearchDialog] = useState({
    open: false,
    topic: null as any,
    loading: false,
    result: '',
    progress: [] as ResearchStreamEvent[],
  });

  const handleStartResearch = async (topic: any) => {
    setResearchDialog({
      open: true,
      topic,
      loading: true,
      result: '',
      progress: [],
    });

    try {
      const query = `Research and provide comprehensive information about "${topic.title}": ${topic.subtitle}. Focus on current trends, practical applications, and learning resources.`;

      await ResearchService.runResearch(query, {
        onProgress: (event) => {
          setResearchDialog((prev) => ({
            ...prev,
            progress: [...prev.progress, event],
          }));

          // Show intermediate answers as they come in
          if (event.event === 'lead_answer') {
            setResearchDialog((prev) => ({
              ...prev,
              result: prev.result + (event.data.answer || ''),
            }));
          }
        },
        onFinalReport: (report) => {
          setResearchDialog((prev) => ({
            ...prev,
            result: report,
            loading: false,
          }));
        },
        onError: (error) => {
          console.error('Research error:', error);
          setResearchDialog((prev) => ({
            ...prev,
            loading: false,
            result: typeof error === 'object' && 'message' in error ? error.message : 'An error occurred during research. Please try again.',
          }));
        },
      });
    } catch (error) {
      console.error('Failed to start research:', error);
      setResearchDialog((prev) => ({
        ...prev,
        loading: false,
        result: 'Failed to start research. Please try again.',
      }));
    }
  };

  const handleCloseDialog = () => {
    setResearchDialog({
      open: false,
      topic: null,
      loading: false,
      result: '',
      progress: [],
    });
  };

  const topics = [
    {
      title: 'AI Programming Fundamentals',
      subtitle: 'Learn how developers integrate AI into modern applications',
      icon: '💻',
      category: 'Programming',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: 'Fintech AI Revolution',
      subtitle: 'How AI transforms digital banking and financial services',
      icon: '🏦',
      category: 'Fintech',
      difficulty: 'Intermediate',
      duration: '3-4 hours',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      title: 'AI Energy Efficiency',
      subtitle: 'Understanding the environmental impact of AI systems',
      icon: '⚡',
      category: 'Sustainability',
      difficulty: 'Advanced',
      duration: '1-2 hours',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      title: 'Machine Learning Basics',
      subtitle: 'Core algorithms and real-world applications',
      icon: '🤖',
      category: 'ML Fundamentals',
      difficulty: 'Beginner',
      duration: '4-5 hours',
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      title: 'Neural Networks Deep Dive',
      subtitle: 'Architecture and training of artificial neural networks',
      icon: '🧠',
      category: 'Deep Learning',
      difficulty: 'Advanced',
      duration: '6-8 hours',
      gradient: ['#fa709a', '#fee140'],
    },
    {
      title: 'Computer Vision Mastery',
      subtitle: 'Image processing and recognition with AI',
      icon: '👁️',
      category: 'Computer Vision',
      difficulty: 'Intermediate',
      duration: '5-6 hours',
      gradient: ['#a8edea', '#fed6e3'],
    },
  ];

  const categories = ['All', 'Programming', 'Fintech', 'Sustainability', 'ML Fundamentals', 'Deep Learning', 'Computer Vision'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#43e97b';
      case 'Intermediate':
        return '#f093fb';
      case 'Advanced':
        return '#667eea';
      default:
        return '#4a5568';
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <Box>
          {/* Header Section */}
          <Fade in timeout={600}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ fontSize: '3rem', mr: 2 }}>🧠</Box>
                <Box>
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
                      mb: 1,
                    }}
                  >
                    AI & Deep Learning
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      fontWeight: 500,
                      maxWidth: '600px',
                    }}
                  >
                    Explore the fascinating world of artificial intelligence, machine learning, and cutting-edge AI technologies
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Category Filter */}
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2d3748' }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {categories.map((category, index) => (
                  <Chip
                    key={category}
                    label={category}
                    variant={index === 0 ? 'filled' : 'outlined'}
                    clickable
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      ...(index === 0
                        ? {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            },
                          }
                        : {
                            borderColor: 'rgba(102, 126, 234, 0.3)',
                            color: '#4a5568',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              borderColor: theme.palette.primary.main,
                            },
                          }),
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>

          {/* Topics Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            {topics.map((topic, index) => (
              <Box key={index}>
                <Fade in timeout={1000 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                        '& .gradient-overlay': {
                          opacity: 0.1,
                        },
                      },
                    }}
                  >
                    {/* Gradient overlay */}
                    <Box
                      className="gradient-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${topic.gradient[0]} 0%, ${topic.gradient[1]} 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                        <Box sx={{ fontSize: '2.5rem' }}>{topic.icon}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            label={topic.category}
                            size="small"
                            sx={{
                              mb: 2,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: alpha(getDifficultyColor(topic.difficulty), 0.1),
                              color: getDifficultyColor(topic.difficulty),
                              border: `1px solid ${alpha(getDifficultyColor(topic.difficulty), 0.2)}`,
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              color: '#2d3748',
                              fontSize: '1.1rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {topic.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.5, mb: 2 }}>
                            {topic.subtitle}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            <Chip
                              label={topic.difficulty}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                borderColor: getDifficultyColor(topic.difficulty),
                                color: getDifficultyColor(topic.difficulty),
                              }}
                            />
                            <Chip
                              label={topic.duration}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                borderColor: '#4a5568',
                                color: '#4a5568',
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 4, pt: 0, position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                        <Button
                          component={Link}
                          to="/chat"
                          size="small"
                          variant="contained"
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            py: 0.5,
                            fontWeight: 500,
                            textTransform: 'none',
                            background: `linear-gradient(135deg, ${topic.gradient[0]} 0%, ${topic.gradient[1]} 100%)`,
                            '&:hover': {
                              boxShadow: `0 8px 25px ${alpha(topic.gradient[0], 0.3)}`,
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Start Learning
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStartResearch(topic)}
                          sx={{
                            borderRadius: 2,
                            py: 0.5,
                            px: -1.5,
                            borderColor: topic.gradient[0],
                            color: topic.gradient[0],
                            '&:hover': {
                              borderColor: topic.gradient[1],
                              backgroundColor: alpha(topic.gradient[0], 0.1),
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <SearchIcon />
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Fade>
              </Box>
            ))}
          </Box>

          {/* Featured CTA Section */}
          <Fade in timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background decoration */}
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

              <Box sx={{ fontSize: '3rem', mb: 3 }}>🚀</Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: '#2d3748',
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                }}
              >
                Start Your AI Journey Today
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontSize: { xs: '0.8rem', sm: '0.8rem' },
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                From fundamental concepts to advanced applications, VuiHoi AI will guide you through the fascinating world of artificial intelligence and machine learning.
              </Typography>
              <Button
                component={Link}
                to="/chat"
                variant="contained"
                size="small"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px) scale(1.02)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Get Started Now
              </Button>
            </Paper>
          </Fade>

          {/* Research Dialog */}
          <Dialog
            open={researchDialog.open}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 3,
                maxHeight: '80vh',
              },
            }}
          >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SearchIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Research: {researchDialog.topic?.title}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
              {researchDialog.loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={40} />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      Researching {researchDialog.topic?.title}
                    </Typography>
                  </Box>

                  {/* Live progress updates */}
                  <Box sx={{ width: '100%' }}>
                    {researchDialog.progress.map((event, index) => (
                      <Box key={index} sx={{ mb: 2, p: 3, borderRadius: 3, backgroundColor: 'grey.50', borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1, fontSize: '0.75rem' }}>
                          {event.event.replace(/_/g, ' ')}
                        </Typography>
                        {event.event === 'lead_thinking' && (
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                            💭 {event.data.thinking}
                          </Typography>
                        )}
                        {event.event === 'web_search_query' && (
                          <Typography variant="body2" sx={{ color: 'success.main' }}>
                            🔍 Searching: "{event.data.query}"
                          </Typography>
                        )}
                        {event.event === 'web_search_results' && (
                          <Typography variant="body2" sx={{ color: 'info.main' }}>
                            📄 Found {event.data.results?.length || 0} results
                          </Typography>
                        )}
                        {event.event === 'lead_answer' && (
                          <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            ✨ {event.data.answer}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>

                  {/* Show partial results if available */}
                  {researchDialog.result && (
                    <Box sx={{ mt: 3, p: 3, borderRadius: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Partial Results:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {researchDialog.result.substring(0, 200)}...
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  {researchDialog.result ? (
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                          '& h1': { fontSize: '0.9rem', fontWeight: 500, mb: 2, mt: 3 },
                          '& h2': { fontSize: '0.9rem', fontWeight: 500, mb: 1.5, mt: 2 },
                          '& h3': { fontSize: '0.9rem', fontWeight: 500, mb: 1, mt: 1.5 },
                          '& p': { mb: 1.5 },
                          '& ul': { pl: 3, mb: 1.5 },
                          '& ol': { pl: 3, mb: 1.5 },
                          '& li': { mb: 0.5 },
                          '& a': {
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          },
                          '& code': {
                            backgroundColor: 'grey.100',
                            padding: '2px 6px',
                            borderRadius: 1,
                            fontSize: '0.9em',
                            fontFamily: 'monospace',
                          },
                          '& blockquote': {
                            borderLeft: '3px solid',
                            borderLeftColor: 'primary.main',
                            pl: 2,
                            py: 1,
                            backgroundColor: 'grey.50',
                            fontStyle: 'italic',
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: researchDialog.result
                            .replace(/\n/g, '<br />')
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code>$1</code>'),
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        No research results available.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try clicking the research button again or use the chat interface.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button onClick={handleCloseDialog} variant="outlined" size="large">
                Close
              </Button>

              {!researchDialog.loading && (
                <Button onClick={() => handleStartResearch(researchDialog.topic)} variant="outlined" color="primary" size="large" startIcon={<SearchIcon />}>
                  Research Again
                </Button>
              )}

              {researchDialog.result && !researchDialog.loading && (
                <Button
                  component={Link}
                  to={`/chat?topic=${encodeURIComponent(researchDialog.topic?.title || '')}&research=${encodeURIComponent(researchDialog.result.substring(0, 200))}`}
                  variant="contained"
                  size="large"
                  sx={{
                    background: `linear-gradient(135deg, ${researchDialog.topic?.gradient[0]} 0%, ${researchDialog.topic?.gradient[1]} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${researchDialog.topic?.gradient[0]} 0%, ${researchDialog.topic?.gradient[1]} 100%)`,
                      opacity: 0.9,
                    },
                  }}
                >
                  Continue in Chat
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default DeepLearningPage;
