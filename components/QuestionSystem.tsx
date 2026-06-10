'use client';

import { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import {createQuestionsFromTexts} from '../utils/filterUtils';
import {useTranslations} from 'next-intl';

type QuestionSystemProps = {
  onFiltersChange: (answers: boolean[]) => void;
};

export default function QuestionSystem({ onFiltersChange }: QuestionSystemProps) {
  const tCommon = useTranslations('common');
  const tWho = useTranslations('whoIsWho');
  const tQuestions = useTranslations('questions');
  const questions = createQuestionsFromTexts([
    tQuestions('q1'),
    tQuestions('q2'),
    tQuestions('q3'),
    tQuestions('q4'),
    tQuestions('q5'),
    tQuestions('q6'),
    tQuestions('q7')
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: boolean) => {
    // Animación de fade out
    setIsVisible(false);
    
    setTimeout(() => {
      // Guardar la respuesta
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      
      // Pasar las respuestas al componente padre
      onFiltersChange(newAnswers);
      
      // Verificar si hay más preguntas
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsVisible(true);
        
        // Animación de shock después del fade in
        setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 300);
        }, 100);
      } else {
        // Terminaron las preguntas
        setIsFinished(true);
        setIsVisible(true);
      }
    }, 300); // Duración del fade out
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setIsVisible(true);
    onFiltersChange([]);
  };

  if (isFinished) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isShaking ? 'scale(1.05)' : 'scale(1)',
          transition: isShaking ? 'transform 0.3s ease-in-out' : 'opacity 0.3s ease-in-out'
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#033778',
            fontWeight: 'bold',
            mb: 1,
            fontFamily: 'var(--font-source-sans-pro), sans-serif'
          }}
        >
          {tWho('possibleTwins')}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRestart}
          sx={{
            backgroundColor: '#033778',
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#022a5a'
            }
          }}
        >
          {tCommon('restart')}
        </Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box
      sx={{
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isShaking ? 'scale(1.05)' : 'scale(1)',
        transition: isShaking ? 'transform 0.3s ease-in-out' : 'opacity 0.3s ease-in-out'
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: '#033778',
          fontWeight: 'bold',
          mb: 1,
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
          onClick={() => handleAnswer(true)}
          sx={{
            minWidth: { xs: '100%', sm: '120px' },
            py: 0.6,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '25px',
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            textTransform: 'none',
            lineHeight: 1.1
          }}
        >
          {tCommon('yes')}
        </Button>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => handleAnswer(false)}
          sx={{
            minWidth: { xs: '100%', sm: '120px' },
            py: 0.6,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '25px',
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            textTransform: 'none',
            lineHeight: 1.1
          }}
        >
          {tCommon('no')}
        </Button>
      </Box>
    </Box>
  );
} 