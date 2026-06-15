import { useState, useEffect } from 'react';
import { caricaturesData } from '@/data/imagesData';
import { CaricatureImage, filterImagesBySequence, questionFeatures } from '@/utils/filterUtils';
import {trackEvent, trackQuestionAnswer} from '@/lib/analytics';

type LabelsMap = Record<string, number[]>;

export const useCaricatureFilter = () => {
  const [images, setImages] = useState<CaricatureImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CaricatureImage[]>([]);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const fallbackByFile = new Map(
      caricaturesData.map((caricature) => [caricature.file, caricature.features])
    );

    const fallbackImages: CaricatureImage[] = caricaturesData.map((caricature) => ({
      name: caricature.file.replace('.jpg', ''),
      src: `/caricatures/${caricature.file}`,
      size: 'Mediana',
      features: caricature.features
    }));

    let isMounted = true;

    const loadImages = async () => {
      try {
        const response = await fetch('/api/labels');
        if (!response.ok) throw new Error('labels fetch failed');

        const data = await response.json() as { files?: string[]; labels?: LabelsMap };
        const files = data.files ?? [];
        const labels = data.labels ?? {};

        const apiImages: CaricatureImage[] = files.map((file) => ({
          name: file.replace('.jpg', ''),
          src: `/caricatures/${file}`,
          size: 'Mediana',
          features: labels[file] ?? fallbackByFile.get(file) ?? [0, 0, 0, 0, 0, 0, 0]
        }));

        if (!isMounted) return;
        setImages(apiImages);
        setFilteredImages(apiImages);
      } catch {
        if (!isMounted) return;
        setImages(fallbackImages);
        setFilteredImages(fallbackImages);
      }
    };

    void loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      setTimeout(() => {
        void trackEvent('question_sequence_start', {
          mode: '2d',
          source: 'auto_open',
          total_count: images.length
        });
        setQuestionModalOpen(true);
      }, 1000);
    }
  }, [images]);

  const handleAnswer = (answer: boolean) => {
    const questionIndex = currentQuestionIndex;
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    setIsFiltering(true);
    
    setTimeout(() => {
      const filtered = filterImagesBySequence(images, newAnswers);
      setFilteredImages(filtered);
      setIsFiltering(false);
      void trackQuestionAnswer({
        mode: '2d',
        question_index: questionIndex + 1,
        feature_index: questionFeatures[questionIndex],
        answer: answer ? 'yes' : 'no',
        answers_count: newAnswers.length,
        remaining_count: filtered.length
      });
      
      if (currentQuestionIndex < questionFeatures.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        void trackEvent('question_sequence_complete', {
          mode: '2d',
          answers_count: newAnswers.length,
          remaining_count: filtered.length
        });
        setQuestionModalOpen(false);
      }
    }, 300);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      void trackEvent('question_previous', {
        mode: '2d',
        from_question_index: currentQuestionIndex + 1,
        target_question_index: currentQuestionIndex,
        answers_count: answers.length
      });
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
    void trackEvent('question_cancel', {
      mode: '2d',
      question_index: currentQuestionIndex + 1,
      answers_count: answers.length
    });
    setQuestionModalOpen(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFilteredImages(images);
  };

  const handleResetFilters = () => {
    void trackEvent('filter_reset', {
      mode: '2d',
      answers_count: answers.length,
      previous_count: filteredImages.length,
      total_count: images.length
    });
    setQuestionModalOpen(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFilteredImages(images);
  };

  const handleRestartSequence = () => {
    void trackEvent('question_sequence_start', {
      mode: '2d',
      source: 'restart_button',
      total_count: images.length
    });
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