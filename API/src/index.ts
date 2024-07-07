import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import userRoutes from './routes/userRoutes';
import profilePictureRoutes from './routes/profilePictureRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

createConnection().then(() => {
  app.use('/api/users', userRoutes);
  app.use('/api/profilePictures', profilePictureRoutes);
  app.use(authMiddleware);

  return app;
}).catch(error => console.log('TypeORM connection error: ', error));

app.listen(process.env.PORT, () => {
  console.log('API Server port : ', process.env.PORT);
});
