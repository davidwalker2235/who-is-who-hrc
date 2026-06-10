'use client';

import { Box, Typography, Container, IconButton } from '@mui/material';
import { 
  YouTube, 
  Facebook, 
  X 
} from '@mui/icons-material';
import InstagramIcon from './InstagramIcon';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: { xs: 'auto', sm: '70px' },
        minHeight: { xs: '100px', sm: '70px' },
        backgroundColor: '#033778',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        py: { xs: 1, sm: 0 }
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            width: '100%',
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              fontWeight: 400,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {t('rights')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'var(--font-source-sans-pro), sans-serif',
                fontWeight: 400,
                mb: { xs: 0.5, sm: 0 },
                mr: { xs: 0, sm: 1 }
              }}
            >
              {t('followUs')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: { xs: 0.5, sm: 1 },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: '#0077B5',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 119, 181, 0.1)'
                  }
                }}
                onClick={() => window.open('https://www.linkedin.com/company/erni/', '_blank', 'noopener,noreferrer')}
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                </svg>
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#E4405F',
                  '&:hover': {
                    backgroundColor: 'rgba(228, 64, 95, 0.1)'
                  }
                }}
                onClick={() => window.open('https://www.instagram.com/ernigroup/', '_blank', 'noopener,noreferrer')}
              >
                <InstagramIcon color="#E4405F" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#FF0000',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                  }
                }}
                onClick={() => window.open('https://www.youtube.com/user/ERNIConsulting', '_blank', 'noopener,noreferrer')}
              >
                <YouTube fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#1877F2',
                  '&:hover': {
                    backgroundColor: 'rgba(24, 119, 242, 0.1)'
                  }
                }}
                onClick={() => window.open('https://www.facebook.com/ernigroup/', '_blank', 'noopener,noreferrer')}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
                onClick={() => window.open('https://x.com/ERNI', '_blank', 'noopener,noreferrer')}
              >
                <X fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 