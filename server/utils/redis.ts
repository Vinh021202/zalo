import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        return new Redis(process.env.REDIS_URL, {
            tls: {}  // Nếu Redis yêu cầu kết nối TLS, giữ phần này, nếu không có thể bỏ qua.
        });
    }
    throw new Error('Redis Connection failed');
};

export const redis = redisClient();