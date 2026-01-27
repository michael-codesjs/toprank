import cors from 'cors';
import express from 'express';
import http from 'http';
import chatRouter from './routers/chat';

export async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json());
  app.use(
    cors<cors.CorsRequest>({
      origin: true, // Allow reflected origin
      credentials: true,
    }),
  );

  // Chat endpoint
  app.use('/api/chat', chatRouter);

  return { app, httpServer };
}
