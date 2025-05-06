import { Task } from "../types/Task";
import { randomUUID } from 'crypto';

export const createTask = <data, result>(f: CallableFunction): Task<data, result> => {
    return {
        id: `tsk-${randomUUID()}`,
        run: (data: data): Promise<result> => {
            return f(data);
        },
    };
};