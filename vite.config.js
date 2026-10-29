import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleStripe } from './server/stripe.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== '/api/stripe') return next();
    handleStripe(req, res, env).catch(() => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Falha interna no pagamento.' }));
    });
  };
  return {
    plugins: [react(), {
      name: 'stripe-local',
      configureServer(server) { server.middlewares.use(middleware); },
      configurePreviewServer(server) { server.middlewares.use(middleware); },
    }],
    server: { port: 5173, strictPort: true },
  };
});
