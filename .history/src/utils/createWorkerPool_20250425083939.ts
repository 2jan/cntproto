import { Worker } from 'node:worker_threads';
import { WorkerPool, WorkerPoolOptions } from '../types/WorkerPool';

export const createWorkerpool = (options: WorkerPoolOptions): WorkerPool => {
    const workers = new Map(Array.from({ length: options.workers }).map<[number, Worker]>(() => {
        const w = new Worker('./dist/worker.js')
        return [w.threadId, w]
    }))
    const idle = Array.from(workers.keys())
    const resolvers = new Map<number, (data: any) => void>()
    let backlog: { id: number, task: (data: any) => void, data: any }[] = []
    let taskIdCounter = 0

    return {

    }
}
