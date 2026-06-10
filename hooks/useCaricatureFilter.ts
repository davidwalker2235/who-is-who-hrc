import { useState, useEffect } from 'react';
import { caricaturesData } from '@/data/imagesData';
import { CaricatureImage, filterImagesBySequence, questionFeatures } from '@/utils/filterUtils';

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