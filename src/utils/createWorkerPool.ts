import { Worker } from 'node:worker_threads';
import { WorkerPool, WorkerPoolOptions } from '../types/WorkerPool';

export const createWorkerpool = (options: WorkerPoolOptions): WorkerPool => {
    const workers = new Map(Array.from({ length: options.workers }).map<[number, Worker]>(() => {
        const w = new Worker('./dist/worker.js');
        return [w.threadId, w];
    }))
    const idle = Array.from(workers.keys());
    const resolvers = new Map<number, (data: any) => void>();
    let backlog: { id: number, task: (data: any) => void, data: any }[] = [];
    let taskIdCounter = 0;
    let terminating = false;
    const runNext = () => {
        if (terminating) return;
        if (backlog.length == 0 || idle.length == 0) return;

        const task = backlog.shift();
        if (!task) return;
        const worker = idle.shift();
        if (!worker) return;
        console.log(`scheduling ${task.id} on ${worker}`);

        const msg = { ...task, task: task.task.toString() };
        workers.get(worker).postMessage(msg);
        runNext();
    };

    workers.forEach((w, i) => {
        w.on('message', data => {
            const { id, result } = data;
            console.log('res', result);
            resolvers.get(Number(id))(result);
            resolvers.delete(id);
            idle.push(i);
            runNext();
        })
    })

    return {

    }
};
