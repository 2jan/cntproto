import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { Step } from './Step';
import { collectTaskResult } from '../tasks/collectTaskResult';
import { collectStepResult } from '../steps/collectStepResult';

export class TaskProcessor extends EventEmitter {
    private steps: Step<any, any>[];

    constructor() {
        super();
        this.steps = [];
    }

    public createStep(): Step<any, any> {
        const stepId = `stp-${randomUUID()}`;

        const step: Step<any, any> = {
            id: stepId,
            tasks: [],
            addTask: (task) => {
                step.tasks.push(task);
                this.emit('taskAdded', { task, stepId });
            },
            run: (data) => {
                this.emit('stepStarted', { step, data });
                const promises = step.tasks.map((task) => {
                    return new Promise((resolve, reject) => {
                        this.emit('taskStarted', { task, data });
                        try {
                            const result = task.run(data);
                            resolve(result);
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                });
                Promise.allSettled(
                    promises
                ).then((results) => {
                    results.forEach((result, idx) => {
                        this.emit('taskResult', collectTaskResult(step.tasks[idx], result));
                    });
                    
                    this.emit('stepCompleted', collectStepResult(step, results));
                });
            },
        };
        this.steps.push(step);
        this.emit('stepCreated', step);
        return step;
    };
};
