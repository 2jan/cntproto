import { Task, TaskResult } from '../types/Task';

export const collectTaskResult = <data, result>(task: Task<data, result>, result: PromiseSettledResult<result>): TaskResult<result> => {
    return {
        taskId: task.id,
        status: result.status === 'fulfilled' ? 'completed' : 'failed',
        result: result.status === 'fulfilled' ? result.value : result.reason,
    };
};