'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LanguageSelector from './LanguageSelector';
import {useTranslations} from 'next-intl';

export default function AppBarComponent() {
  const t = useTranslations('header');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ position: "static", minHeight: '5.5em', maxWidth: '100%', backgroundColor: 'white', boxShadow: 'none' }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2.5,
            px: { xs: 2, sm: 3 }
          }}
        >
          <Box sx={{
            height: { xs: '1.5rem', sm: '2.2386rem' },
            width: { xs: '8rem', sm: '11.5625rem' }
          }}>
            <a href="https://www.betterask.erni/" target="_blank" rel="noopener noreferrer">
              <img
                alt={t('logoAlt')}
                src="/erniLogo.png"
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </a>
          </Box>
          <LanguageSelector />
        </Container>
      </AppBar>
    </Box>
  );
}
