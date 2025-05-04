export interface Task<data, result> {
    id: string;
    run(data: data): Promise<result>;
};

export type TaskResult<result> = {
    taskId: string;
    status: 'completed' | 'failed';
    result: result;
};

