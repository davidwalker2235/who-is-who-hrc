import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Fade, Slide, CircularProgress } from '@mui/material';
import CaricatureCard from './CaricatureCard';
import { CaricatureImage } from '@/utils/filterUtils';
import {useTranslations} from 'next-intl';

interface CaricatureGridProps {
  images: CaricatureImage[];
  isFiltering: boolean;
  onOpenModal: (image: CaricatureImage) => void;
  onDownload: (imageSrc: string, imageName: string) => void;
}

const CHUNK_SIZE = 30;

export default function CaricatureGrid({
  images,
  isFiltering,
  onOpenModal,
  onDownload
}: CaricatureGridProps) {
  const t = useTranslations('grid');
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [images]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || isFiltering) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, images.length));
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [images.length, isFiltering]);

  const visibleImages = useMemo(
    () => images.slice(0, Math.min(visibleCount, images.length)),
    [images, visibleCount]
  );

  if (images.length === 0 && !isFiltering) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t('noneFound')}
        </Typography>
      </Box>
    );
  }

  if (isFiltering) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t('filtering')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
        xl: 'repeat(6, 1fr)'
      },
      gap: 3,
      mt: 3
    }}>
      {visibleImages.map((image, index) => (
        <Fade 
          key={image.name} 
          in={!isFiltering} 
          timeout={300}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <Slide 
            direction="up" 
            in={!isFiltering} 
            timeout={300}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div>
              <CaricatureCard
                image={image}
                index={index}
                isFiltering={isFiltering}
                onOpenModal={onOpenModal}
                onDownload={onDownload}
              />
            </div>
          </Slide>
        </Fade>
      ))}
      {visibleCount < images.length && (
        <Box
          ref={loadMoreRef}
          sx={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            py: 2
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
} 