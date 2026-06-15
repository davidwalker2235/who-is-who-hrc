'use client';

import { 
  Modal, 
  Paper, 
  Box, 
  IconButton,
  Typography
} from '@mui/material';
import { 
  Close, 
  Download 
} from '@mui/icons-material';
import {useTranslations} from 'next-intl';
import {trackButtonClick, trackDownload, trackModalClose} from '@/lib/analytics';

interface ImageModalProps {
  open: boolean;
  selectedImage: {
    src: string;
    name: string;
  } | null;
  onClose: () => void;
  onDownload: (imageSrc: string, imageName: string) => void;
  analyticsMode?: string;
}

export default function ImageModal({
  open,
  selectedImage,
  onClose,
  onDownload,
  analyticsMode = 'unknown'
}: ImageModalProps) {
  const tCommon = useTranslations('common');
  const modalButtonPrefix = analyticsMode === '2d' || analyticsMode === '3d'
    ? `button.${analyticsMode}.image-modal`
    : 'button.image-modal';

  const handleClose = () => {
    void trackButtonClick(`${modalButtonPrefix}.close`, {
      surface: 'image_modal',
      mode: analyticsMode,
      image_name: selectedImage?.name
    });
    void trackModalClose('image_modal', {
      surface: 'image_modal',
      mode: analyticsMode,
      image_name: selectedImage?.name
    });
    onClose();
  };

  const handleDownload = () => {
    if (!selectedImage) return;

    void trackDownload(`${modalButtonPrefix}.download`, selectedImage.src, selectedImage.name, {
      surface: 'image_modal',
      mode: analyticsMode,
      image_name: selectedImage.name
    });
    onDownload(selectedImage.src, selectedImage.name);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          outline: 'none',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header del modal */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#033778',
          color: 'white'
        }}>
          <Typography 
            variant="h6" 
            sx={{
              color: 'white',
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              fontWeight: 600
            }}
          >
            {selectedImage?.name}
          </Typography>
          
          <IconButton
            onClick={handleClose}
            aria-label={tCommon('close')}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box
          component="img"
          src={selectedImage?.src}
          alt={selectedImage?.name}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain',
            display: 'block'
          }}
        />

        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          bgcolor: 'background.paper'
        }}>
          <IconButton
            onClick={handleDownload}
            size="large"
            aria-label={tCommon('download')}
            sx={{
              bgcolor: '#033778',
              color: 'white',
              borderRadius: '25px',
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              '&:hover': {
                bgcolor: '#022a5e'
              }
            }}
          >
            <Download />
          </IconButton>
        </Box>
      </Paper>
    </Modal>
  );
} 