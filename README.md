# DuoBudget - Finanzas en Pareja

Web app diseñada para que parejas gestionen su economía compartida de forma inteligente y transparente.

## Stack Tecnológico
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: TailwindCSS + shadcn/ui (Estilo Midnight Emerald)
- **Gráficos**: Recharts
- **Backend & DB**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Seguridad**: Next.js Server Actions + Firebase Admin SDK para operaciones sensibles.

## Requisitos Previos
1. Node.js 18+ instalado.
2. Un proyecto de Firebase creado en [Firebase Console](https://console.firebase.google.com/).

## Configuración del Proyecto

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env.local` y completa los valores con los de tu proyecto Firebase:

```bash
# Firebase Client SDK (Desde Configuración del Proyecto > Tus apps)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Cuentas de servicio > Generar nueva clave privada)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Configuración de Cloudinary (Storage)
DuoBudget utiliza Cloudinary para gestionar los comprobantes de gastos por su facilidad de optimización.
1. Crea una cuenta en [Cloudinary](https://cloudinary.com/).
2. En el Dashboard, obtén tu `Cloud Name`.
3. En Settings > Upload, crea un **Unsigned Upload Preset** (esto permite subir imágenes desde el cliente sin firmar).
4. Copia estos valores a tu `.env.local`.

### 3. Instalación
```bash
npm install
```

### 3. Despliegue de Reglas e Índices
Asegúrate de tener `firebase-tools` instalado (`npm install -g firebase-tools`).
```bash
firebase login
firebase use --add your_project_id
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 4. Cloud Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 5. Desarrollo Local
```bash
npm run dev
```

## Arquitectura de Seguridad
- **Lectura**: Permitida desde el cliente para miembros del workspace.
- **Transacciones**: Escritura permitida desde el cliente solo para roles ADMIN y EDITOR.
- **Gestión (Settings, Miembros, Invites)**: Bloqueada en el cliente. Se realiza exclusivamente mediante **Server Actions** usando el Admin SDK para validar permisos de ADMIN.

## Estructura de Firestore
- `/workspaces/{wsID}`: Configuración del espacio.
- `/workspaces/{wsID}/members/{uid}`: Roles (ADMIN, EDITOR, VIEWER).
- `/workspaces/{wsID}/transactions/{txID}`: Datos financieros compartidos.
- `/workspaces/{wsID}/monthly/{monthKey}`: Agregados calculados por Cloud Functions.
- `/invites/{token}`: Invitaciones para nuevos miembros (Top-level).

## Despliegue en Vercel
1. Conecta tu repositorio de GitHub a Vercel.
2. Configura todas las variables de entorno en el panel de Vercel.
3. Asegúrate de escapar correctamente la `FIREBASE_PRIVATE_KEY` (usando comillas y \n para los saltos de línea).
