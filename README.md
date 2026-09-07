# MTK Media

Sitio público y panel administrativo de MTK Media. El proyecto usa Next.js, Supabase para autenticación y datos, y Cloudinary para los videos.

## Requisitos

- Node.js 22+
- npm
- Un proyecto Supabase configurado
- Una cuenta Cloudinary configurada para uploads firmados

## Desarrollo local

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Variables requeridas por Next.js:

```env
NEXT_PUBLIC_SITE_URL=https://www.mtkmediagroup.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` es opcional.

## Supabase y Cloudinary

Las migraciones versionadas están en `supabase/migrations`. Las funciones de subida y eliminación están en `supabase/functions`.

```bash
supabase db push
supabase secrets set CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=...
supabase functions deploy cloudinary-signature
supabase functions deploy cloudinary-media-delete
```

`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` son variables internas disponibles para las Edge Functions de Supabase. Nunca deben exponerse con el prefijo `NEXT_PUBLIC_`.

## Validación

```bash
npm run typecheck
npm run lint
npm run build
```

## Despliegue

El proyecto está listo para desplegarse en Vercel:

1. Importar este repositorio.
2. Configurar las tres variables públicas indicadas arriba para Production, Preview y Development.
3. Usar Node.js 22 y el comando de build `npm run build`.
4. Asociar `www.mtkmediagroup.com` y actualizar `NEXT_PUBLIC_SITE_URL` si cambia el dominio final.
5. En Supabase Auth, registrar el dominio de producción y las URLs de redirección autorizadas.

El archivo `.env.local`, las credenciales, `.next` y `node_modules` están excluidos de Git.
