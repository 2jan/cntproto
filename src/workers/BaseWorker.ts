import { TaskProcessor } from "../types/TaskProcessor";
import { Worker } from "../types/Worker";

export abstract class BaseWorker implements Worker {
    private taskProcessor: TaskProcessor;

    constructor() {
        this.taskProcessor = new TaskProcessor();
    };

    public run = <data>(data: data): void => {
        
    };

};