'use client';

import { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Button,
  Fab
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import QuestionModal from "@/components/QuestionModal";
import ImageModal from "@/components/ImageModal";
import CaricatureGrid from "@/components/CaricatureGrid";
import Footer from "@/components/Footer";
import { useCaricatureFilter } from "@/hooks/useCaricatureFilter";
import { downloadImage, createQuestionsFromTexts, CaricatureImage } from "@/utils/filterUtils";
import {useTranslations} from 'next-intl';

export default function WhoIsWho() {
  const [selectedImage, setSelectedImage] = useState<CaricatureImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const {
    filteredImages,
    questionModalOpen,
    currentQuestionIndex,
    answers,
    isFiltering,
    handleAnswer,
    handlePreviousQuestion,
    handleCancelQuestions,
    handleResetFilters,
    handleRestartSequence
  } = useCaricatureFilter();

  const handleOpenModal = (image: CaricatureImage) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4, pb: '90px' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontWeight: 600,
            color: '#033778',
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            fontSize: { xs: '3.25rem', md: '4rem' },
            lineHeight: 1.2
          }}>
            {tWho('title')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRestartSequence}
            sx={{
              backgroundColor: '#033778',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              '&:hover': {
                backgroundColor: '#022a5e'
              },
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 4px 12px rgba(3, 55, 120, 0.3)'
            }}
          >
            {tWho('findCaricature')}
          </Button>
        </Box>

        <CaricatureGrid
          images={filteredImages}
          isFiltering={isFiltering}
          onOpenModal={handleOpenModal}
          onDownload={downloadImage}
        />
      </Container>

      {answers.length > 0 && (
        <Fab
          color="primary"
          aria-label={tWho('resetFiltersAria')}
          onClick={handleResetFilters}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.2)'
            }
          }}
        >
          <Refresh />
        </Fab>
      )}

      <QuestionModal
        open={questionModalOpen}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onPrevious={handlePreviousQuestion}
        onCancel={handleCancelQuestions}
      />

      <ImageModal
        open={modalOpen}
        selectedImage={selectedImage}
        onClose={handleCloseModal}
        onDownload={downloadImage}
      />

      <Footer />
    </>
  );
}
