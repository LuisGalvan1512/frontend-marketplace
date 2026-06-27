# TechStore - Frontend Marketplace

Interfaz de usuario web interactiva para TechStore, una tienda e-commerce de productos electrónicos generales. Desarrollado con Next.js 15, TypeScript y Tailwind CSS utilizando el App Router.

---

## Características Principales

- **Diseño Premium**: Interfaz minimalista con estética moderna inspirada en Apple, incluyendo efectos de desenfoque de fondo (glassmorphism), tarjetas suaves y transiciones de hover cuidadas.
- **Soporte Light & Dark Mode**: Alternancia de temas claro y oscuro fluidos mediante variables globales CSS y un switch en la barra de navegación, con persistencia local mediante `localStorage`.
- **Filtro por Categorías**: Barra de navegación horizontal deslizante para filtrar el catálogo en tiempo real.
- **Autenticación Integrada**: Vistas premium para inicio de sesión y registro de cuentas.
- **Seguridad en Rutas (Middleware)**: Implementación de Next.js `middleware.ts` para restringir el acceso a rutas administrativas (`/admin`) a usuarios no autorizados (redirige a clientes sin rol de administrador). Persistencia de sesiones segura gestionada mediante cookies (`js-cookie`).
- **Showcase a dos columnas**: Vista detallada de productos que resalta la imagen y la ficha técnica del producto.

---

## Estructura del Proyecto

```text
frontend-marketplace/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx        # Dashboard de Administración (CRUD)
│   │   ├── login/
│   │   │   └── page.tsx        # Página de Inicio de Sesión
│   │   ├── register/
│   │   │   └── page.tsx        # Página de Creación de Cuentas
│   │   ├── products/[id]/
│   │   │   └── page.tsx        # Vista de Detalle de Producto
│   │   ├── globals.css         # Importación de Tailwind y variantes dark
│   │   ├── layout.tsx          # Estructura del Layout y Providers
│   │   └── page.tsx            # Home Page (Catálogo de productos y filtros)
│   ├── components/
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx          # Header con Switcher de Tema y Auth Status
│   ├── context/
│   │   ├── AuthContext.tsx     # Contexto global de sesión y login cookies
│   │   └── ThemeContext.tsx    # Contexto global de temas claro/oscuro
│   ├── types/
│   │   └── product.ts          # Interfaces de tipado TypeScript
│   └── middleware.ts           # Control de acceso a rutas del App Router
├── .env.local                  # Variable de entorno de conexión API local
├── .gitignore
└── package.json
```

---

## Instrucciones de Ejecución Local

1. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
2. Asegurarse de tener un archivo `.env.local` en la raíz de `frontend-marketplace` con la URL de tu API del backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
3. Ejecutar el servidor de Next.js en desarrollo (especificando puerto 3001 para evitar conflictos):
   ```bash
   npm run dev -- -p 3001
   ```

El frontend estará corriendo en [http://localhost:3001](http://localhost:3001).

---

## Despliegue en Vercel

1. Crea un proyecto en [Vercel](https://vercel.com) y enlaza tu repositorio.
2. Configura los directorios del proyecto y en el apartado de **Environment Variables** añade:
   - `NEXT_PUBLIC_API_URL`: `https://tu-backend-en-render.onrender.com/api`
3. Haz clic en Deploy.
