# React + Vite

## Pagos con Stripe

Configura `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` en el entorno local/de despliegue del frontend y `STRIPE_SECRET=sk_test_...` únicamente en el entorno del backend. Reinicia Vite después de cambiar la variable pública. No uses llaves secretas en variables `VITE_`.

El formulario de `HomeClient` utiliza Stripe Elements para alojar de forma segura los campos del número, expiración y CVC; esos datos no se envían a Laravel. El endpoint autenticado crea la cotización desde el crédito activo, y solo se registra el abono cuando Stripe confirma la captura. Para desplegar, ejecuta también `php artisan migrate --force` en el backend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
