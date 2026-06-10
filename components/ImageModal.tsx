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

interface ImageModalProps {
  open: boolean;
  selectedImage: {
    src: string;
    name: string;
  } | null;
  onClose: () => void;
  onDownload: (imageSrc: string, imageName: string) => void;
}

export default function ImageModal({
  open,
  selectedImage,
  onClose,
  onDownload
}: ImageModalProps) {
  const tCommon = useTranslations('common');

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            onClick={onClose}
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
            onClick={() => selectedImage && onDownload(selectedImage.src, selectedImage.name)}
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