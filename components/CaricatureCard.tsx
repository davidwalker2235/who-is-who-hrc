import { 
  Card, 
  CardMedia, 
  Typography, 
  Box, 
  CardActions, 
  IconButton 
} from '@mui/material';
import { 
  ZoomIn, 
  Download 
} from '@mui/icons-material';
import {trackButtonClick, trackDownload, trackModalOpen} from '@/lib/analytics';

interface CaricatureImage {
  name: string;
  src: string;
  size: string;
  features: number[];
}

interface CaricatureCardProps {
  image: CaricatureImage;
  index: number;
  isFiltering: boolean;
  onOpenModal: (image: CaricatureImage) => void;
  onDownload: (imageSrc: string, imageName: string) => void;
}

export default function CaricatureCard({
  image,
  index,
  isFiltering,
  onOpenModal,
  onDownload
}: CaricatureCardProps) {
  const imageNumber = image.name.replace(/\.[^/.]+$/, '');

  const openModal = (source: string) => {
    void trackButtonClick(`card.2d.caricature.open-${source}`, {
      surface: 'caricature_grid',
      mode: '2d',
      source,
      image_name: image.name,
      grid_index: index
    });
    void trackModalOpen('image_modal', {
      surface: 'caricature_grid',
      mode: '2d',
      source,
      image_name: image.name
    });
    onOpenModal(image);
  };

  const downloadImage = () => {
    void trackDownload('button.2d.caricature.download', image.src, image.name, {
      surface: 'caricature_grid',
      mode: '2d',
      image_name: image.name,
      grid_index: index
    });
    onDownload(image.src, image.name);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={image.src}
          alt={image.name}
          loading="lazy"
          decoding="async"
          sx={{ 
            objectFit: 'cover',
            cursor: 'pointer'
          }}
          onClick={() => openModal('image')}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            color: '#033778',
            fontWeight: 700,
            fontSize: '0.95rem',
            lineHeight: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            borderRadius: 1,
            px: 0.75,
            py: 0.25
          }}
        >
          {imageNumber}
        </Typography>
      </Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CardActions sx={{ justifyContent: 'center', p: 0 }}>
          <IconButton 
            onClick={() => openModal('icon')}
            size="small"
            sx={{
              color: '#033778'
            }}
          >
            <ZoomIn />
          </IconButton>
          <IconButton 
            onClick={downloadImage}
            size="small"
            sx={{
              color: '#033778'
            }}
          >
            <Download />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
} 