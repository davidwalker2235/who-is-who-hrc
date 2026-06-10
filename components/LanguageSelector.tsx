'use client';

import {MouseEvent, useState} from 'react';
import {Box, Button, Menu, MenuItem} from '@mui/material';
import {KeyboardArrowDown} from '@mui/icons-material';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

const languages = [
  {locale: 'en', flagSrc: '/englishFlag.png', labelKey: 'english'},
  {locale: 'es', flagSrc: '/spanishFlag.png', labelKey: 'spanish'}
] as const;

export default function LanguageSelector() {
  const tCommon = useTranslations('common');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLanguage = languages.find((language) => language.locale === locale) ?? languages[0];
  const menuOpen = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLocale = (nextLocale: 'en' | 'es') => {
    router.replace(pathname, {locale: nextLocale});
    handleClose();
  };

  return (
    <Box>
      <Button
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
        aria-label={tHeader('languageSelectorAria')}
        sx={{
          color: '#033778',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 999,
          px: 1.25
        }}
      >
        <Box
          component="img"
          src={currentLanguage.flagSrc}
          alt={tCommon(currentLanguage.labelKey)}
          sx={{width: 24, height: 16, mr: 1, objectFit: 'cover', borderRadius: '2px'}}
        />
        {tCommon(currentLanguage.labelKey)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
      >
        {languages.map((language) => (
          <MenuItem key={language.locale} onClick={() => handleChangeLocale(language.locale)}>
            <Box
              component="img"
              src={language.flagSrc}
              alt={tCommon(language.labelKey)}
              sx={{width: 24, height: 16, mr: 1, objectFit: 'cover', borderRadius: '2px'}}
            />
            {tCommon(language.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
