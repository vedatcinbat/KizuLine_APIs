require('reflect-metadata');
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { AppDataSource } from './ormconfig';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error('Database connection error:', error);
    });

io.on('connection', (socket: any) => {
    console.log('New client connected:', socket.id);

    socket.on('message', (data: any) => {
        console.log('Message received:', data);

        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

export { app }
