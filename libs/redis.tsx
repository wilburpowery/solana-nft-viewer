import redis from 'ioredis';

const Redis = new redis(process.env.REDIS_URL);

export default Redis;
