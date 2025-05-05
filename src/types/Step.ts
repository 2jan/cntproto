import { Task } from './Task';

export interface Step<data, result> {
    id: string;
    tasks: Task<any, any>[];
    addTask(task: Task<any, any>): void;
    run(data: data): void;
};

export type StepResult<result> = {
    status: 'completed' | 'failed';
    result: Map<string, result | Error>;
};