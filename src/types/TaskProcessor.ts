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
                this.emit('stepStarted', step);
                Promise.allSettled(
                    step.tasks.map((task) => {
                        this.emit('taskStarted', task);
                        return task.run(data);
                    })
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
