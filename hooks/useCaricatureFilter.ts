import { useState, useEffect } from 'react';
import { caricaturesData } from '@/data/imagesData';
import { CaricatureImage, filterImagesBySequence, questionFeatures } from '@/utils/filterUtils';

export const useCaricatureFilter = () => {
  const [images, setImages] = useState<CaricatureImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CaricatureImage[]>([]);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const allImageData: CaricatureImage[] = caricaturesData.map(caricature => ({
      name: caricature.file.replace('.png', ''),
      src: `/caricatures/${caricature.file}`,
      size: 'Mediana',
      features: caricature.features
    }));

    setImages(allImageData);
    setFilteredImages(allImageData);
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      setTimeout(() => {
        setQuestionModalOpen(true);
      }, 1000);
    }
  }, [images]);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    setIsFiltering(true);
    
    setTimeout(() => {
      const filtered = filterImagesBySequence(images, newAnswers);
      setFilteredImages(filtered);
      setIsFiltering(false);
      
      if (currentQuestionIndex < questionFeatures.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuestionModalOpen(false);
      }
    }, 300);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      setIsFiltering(true);
      setTimeout(() => {
        const filtered = filterImagesBySequence(images, newAnswers);
        setFilteredImages(filtered);
        setIsFiltering(false);
      }, 300);
    }
  };

  const handleCancelQuestions = () => {
    setQuestionModalOpen(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFilteredImages(images);
  };

  const handleResetFilters = () => {
    setQuestionModalOpen(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFilteredImages(images);
  };

  const handleRestartSequence = () => {
    setQuestionModalOpen(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFilteredImages(images);
    
    setTimeout(() => {
      setQuestionModalOpen(true);
    }, 300);
  };

  return {
    images,
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
  };
}; 