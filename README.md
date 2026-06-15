# who-is-who-hrc

## Analytics

La app usa Firebase Analytics / Google Analytics 4 para registrar visitas, engagement de pagina y eventos personalizados de UI. Vercel Analytics se ha retirado para evitar duplicar metricas de pagina.

### Variables de entorno

En local, define estas variables en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_APP_ENV=local
```

Las mismas variables deben existir en Vercel en **Project Settings > Environment Variables** para los entornos que uses: Production, Preview y Development.

El prefijo `NEXT_PUBLIC_` es necesario porque Firebase Analytics web corre en el navegador. Vercel avisa de que estas variables son publicas porque se incluyen en el bundle cliente; eso es esperado para la configuracion web de Firebase. No pongas secretos privados en variables `NEXT_PUBLIC_*`. Protege el proyecto con reglas de Firebase, dominios autorizados y restricciones de API key por HTTP referrer en Google Cloud/Firebase.

No hace falta crear GitHub Secrets para Analytics si Vercel compila y despliega directamente desde el repositorio usando sus Environment Variables. Solo crea secrets en GitHub si tienes un workflow de GitHub Actions que ejecute `next build`, tests o deploys fuera de Vercel; en ese caso usa los mismos nombres `NEXT_PUBLIC_FIREBASE_*`.

### ID de usuario y propiedades

El archivo `lib/analyticsUserConfig.ts` deja `user_id` desactivado por defecto. Cuando exista un identificador interno, debe ser opaco o hasheado y no debe contener email, telefono, DNI, nombre ni ningun dato que identifique directamente a una persona.

Las propiedades de usuario se configuran desde ese mismo archivo. Google Analytics permite hasta 25 propiedades de usuario por proyecto; crea tambien las definiciones personalizadas correspondientes en Firebase/GA4 si quieres usarlas en informes.

### Eventos implementados

El provider global registra:

- `page_view` en cambios de ruta.
- `page_engagement` con tiempo de uso por pagina.
- `scroll_depth` al 25, 50, 75 y 90 por ciento.
- UTM/referrer cuando existan: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`.

Los componentes registran eventos de botones y acciones con IDs estables, por ejemplo:

- `button_click` con `button_id` para todos los botones principales.
- `cta_click` para CTAs de home.
- `outbound_link_click` para enlaces externos.
- `download_click` para descargas.
- `question_answer`, `question_previous`, `question_cancel` y `question_sequence_complete` para los flujos 2D/3D.
- `modal_open` y `modal_close` para modales de imagen.
- `label_feature_toggle`, `label_action` y `label_save_result` para `/label`.

Para ver parametros personalizados como `button_id`, `surface`, `mode`, `question_index`, `image_name`, `scroll_percent` o `time_on_page_seconds` en informes estandar, crea dimensiones/metrica personalizadas en GA4/Firebase. En DebugView y BigQuery export se pueden inspeccionar antes de crear esas definiciones.

### Verificacion

1. Ejecuta `npm run build`.
2. Abre la app en local con `.env.local` configurado.
3. Usa Firebase DebugView o la pestaña Network del navegador para comprobar eventos como `page_view`, `button_click`, `question_answer`, `download_click`, `scroll_depth` y `page_engagement`.
4. En Vercel, configura las variables de entorno, despliega un Preview y confirma que DebugView recibe eventos desde el dominio de Vercel.