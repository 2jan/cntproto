import { Task } from './Task';

export interface WorkerPool {
    createTask<data, result>(f: (d: data) => result): Task<data, result>;
    terminate(): Promise<void>;
};

export interface WorkerPoolOptions {
    workers: number;
};