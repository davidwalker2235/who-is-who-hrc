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
          onClick={() => onOpenModal(image)}
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
            onClick={() => onOpenModal(image)}
            size="small"
            sx={{
              color: '#033778'
            }}
          >
            <ZoomIn />
          </IconButton>
          <IconButton 
            onClick={() => onDownload(image.src, image.name)}
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