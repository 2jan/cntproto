import { Step, StepResult } from "../types/Step";

export const collectStepResult = <data, result>(step: Step<data, result>, results: PromiseSettledResult<any>[]): StepResult<result> => {
    const stepResult: StepResult<result> = {
        status: 'completed',
        result: new Map<string, result | Error>(),
    };
    results.forEach((result, idx) => {
        const task = step.tasks[idx];
        if (result.status === 'fulfilled') {
            stepResult.result.set(task.id, result.value);
        } else {
            stepResult.status = 'failed';
            stepResult.result.set(task.id, result.reason);
        }
    });
    return stepResult;
}