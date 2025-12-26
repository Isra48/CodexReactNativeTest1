# MindCo - Integración con Strapi

Esta guía prepara la app para consumir contenido desde Strapi sin alterar el comportamiento actual basado en mocks.

## Variables de entorno
Define las llaves en `.env` o en la sección `extra` de `app.json` (EAS/Expo):

```
STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_api_token_here
CONTENT_SOURCE=mock
```

- `CONTENT_SOURCE`: `mock` (por defecto) mantiene el comportamiento actual; usa `strapi` para leer desde la API.
- Nunca comitees el token real; utiliza `.env` y variables de entorno en CI.

## Configuración de Expo
En `app.json` se exponen las llaves mediante `expo.extra`. Para EAS, puedes definirlas en `app.config.js` o en los secretos de build y runtime.

## Cliente HTTP
- `src/lib/http/httpClient.js`: wrapper de `fetch` con `baseURL`, headers comunes y timeout.
- `src/lib/strapi/strapiClient.js`: agrega `buildQuery` para `populate`, `filters`, `sort` y `pagination` al estilo Strapi.

## Servicios y repositorios
- `src/services/content/classes.service.js`: llama a `/api/classes` y normaliza la respuesta hacia el modelo interno (campos `title`, `description`, `startDateTime`, etc.).
- `src/services/content/classes.repository.js`: puerta de entrada para el UI. Si `CONTENT_SOURCE=mock` usa los mocks actuales; si es `strapi`, usa el servicio real.
- `src/services/content/events.service.js`: stub listo para eventos (amplía según necesidad).

### Normalización y fechas
- `src/services/content/mappers.js` convierte la respuesta de Strapi (`data/attributes`) al modelo ya utilizado por el UI.
- `src/utils/dateFormatting.js` asegura formatos consistentes. El `timezone` por defecto es `America/Mexico_City`.
- Campos relevantes:
  - `startDateTime`: ISO string.
  - `endDateTime`: ISO string opcional.
  - `date` / `time`: etiquetas amigables para la UI.

## Activar Strapi
1. Configura `STRAPI_URL` y `STRAPI_API_TOKEN` en tus variables de entorno o en `app.json`/`app.config.js`.
2. Establece `CONTENT_SOURCE=strapi`.
3. El UI usa `classes.repository` y continuará funcionando; al cambiar el flag leerá desde Strapi.

## Endpoints y ejemplos de query
- Clases: `GET /api/classes`.
- Ejemplo con populate y sort:

```
/api/classes?populate[image]=true&populate[instructor]=true&sort[startAt]=asc&filters[startAt][$gte]=2024-01-01T00:00:00.000Z
```

Ajusta `pagination[limit]` o `filters` según necesidades de negocio.

## Notas sobre zonas horarias y recordatorios
- Se usa `America/Mexico_City` como zona horaria predeterminada para formatear fechas y horas.
- El helper `src/utils/scheduling.js` expone:
  - `computeClassStatus(startAtISO, now)` → `"live" | "startingSoon" | "future" | "past"`.
  - `computeReminderTriggerDate(startAtISO, minutesBefore)` para calcular cuándo disparar notificaciones.
- No se agenda ninguna notificación nueva automáticamente; la lógica existente puede consumir estos helpers cuando se active Strapi.
