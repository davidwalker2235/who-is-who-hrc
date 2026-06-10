import { 
  Modal, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  IconButton 
} from '@mui/material';
import { 
  ArrowBack
} from '@mui/icons-material';
import {useTranslations} from 'next-intl';

interface Question {
  id: number;
  text: string;
  feature: number;
}

interface QuestionModalProps {
  open: boolean;
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: boolean) => void;
  onPrevious: () => void;
  onCancel: () => void;
}

export default function QuestionModal({
  open,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  onPrevious,
  onCancel
}: QuestionModalProps) {
  const tCommon = useTranslations('common');

  return (
    <Modal
      open={open}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'transparent'
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          width: { xs: '95%', sm: '400px' },
          outline: 'none',
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header con botones de navegación */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#033778',
          color: 'white'
        }}>
          <IconButton
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            sx={{
              visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography 
            variant="body2" 
            sx={{
              color: 'white',
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              fontWeight: 600,
              fontSize: '1.2rem'
            }}
          >
            {tCommon('questionOf', {current: currentQuestionIndex + 1, total: totalQuestions})}
          </Typography>
          
          <IconButton
            onClick={onCancel}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            aria-label={tCommon('close')}
          >
            {/* Icono de X sin círculo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>
        </Box>

        {/* Contenido del modal */}
        <Box sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              color: '#033778',
              fontFamily: 'var(--font-source-sans-pro), sans-serif'
            }}
          >
            {currentQuestion.text}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => onAnswer(true)}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                py: 0.6, // Reducido para que el botón sea más fino
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '25px',
                fontFamily: 'var(--font-source-sans-pro), sans-serif',
                textTransform: 'none',
                lineHeight: 1.1 // Opcional: asegura que el texto no haga el botón más alto
              }}
            >
              {tCommon('yes')}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => onAnswer(false)}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                py: 0.6, // Reducido para que el botón sea más fino
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '25px',
                fontFamily: 'var(--font-source-sans-pro), sans-serif',
                textTransform: 'none',
                lineHeight: 1.1 // Opcional: asegura que el texto no haga el botón más alto
              }}
            >
              {tCommon('no')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
} 