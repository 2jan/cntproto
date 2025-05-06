import { TaskProcessor } from "../types/TaskProcessor";
import { Worker } from "../types/Worker";
import { Step, StepResult } from "../types/Step";
import { StepConfig, StepResultCollector } from "../types/StepConfig";
import { createTask } from "../tasks/createTask";

export abstract class BaseWorker implements Worker {
    protected taskProcessor: TaskProcessor;
    protected steps: Map<string, Step<any, any>>;
    protected stepCollectors: Map<string, StepResultCollector<any>>;
    protected stepIterator: MapIterator<[string, Step<any, any>]>;

    constructor() {
        this.taskProcessor = new TaskProcessor();
        this.steps = new Map();
        this.stepCollectors = new Map();
        this.stepIterator = this.steps[Symbol.iterator]();

        this.taskProcessor.on("stepCreated", this.onStepCreated);
        this.taskProcessor.on("stepStarted", this.onStepStarted);
        this.taskProcessor.on("taskAdded", this.onTaskAdded);
        this.taskProcessor.on("taskStarted", this.onTaskStarted);
        this.taskProcessor.on("taskResult", this.onTaskResult);
        this.taskProcessor.on("stepCompleted", this.onStepCompleted);
        this.taskProcessor.on("taskCompleted", this.onTaskCompleted);
    };

    abstract init(data: any): StepConfig[];

    public run<data>(data: data): void {
        const stepConfig = this.init(data);
        this.addSteps(stepConfig);
        this.stepIterator = this.steps[Symbol.iterator]();
        const firstStep = this.stepIterator.next();
        if (firstStep.done) {
            console.error("No steps to run.");
            return;
        }
        const step = firstStep.value[1];
        step.run(data);
    };

    private addSteps(steps: StepConfig[]): void {
        steps.forEach((stepConfig) => {
            const step = this.taskProcessor.createStep();
            stepConfig.tasks.forEach((task) => {
                const taskInstance = createTask<any, any>(task);
                step.addTask(taskInstance);
            });
            this.steps.set(stepConfig.name, step);
            if (stepConfig.prepareResult) {
                this.stepCollectors.set(stepConfig.name, stepConfig.prepareResult);
            }
        });

    };

    private onStepCreated = (step: Step<any, any>): void => {
        console.debug("Step created:", step);
    };

    private onStepStarted = (step: any): void => {
        console.debug("Step started:", step);
    };

    private onTaskAdded = (data: any): void => {
        console.debug("Task added:", data);
    };

    private onTaskStarted = (task: any): void => {
        console.debug("Task started:", task);
    };

    private onTaskResult = (result: any): void => {
        console.debug("Task result:", result);
    };

    private onStepCompleted = (result: StepResult<any>): void => {
        console.debug("Step completed:", result);
        if (result.status === "failed") {
            console.error("Step failed:", result.result);
            return;
        }
        const step = this.stepIterator.next();
        if (step.done) {
            console.debug("All steps completed.");
        } else {
            step.value[1].run(result);
        }
    };

    private collectStepResult = (stepName: string, result: Map<string, any>): any => {

    };

    private onTaskCompleted = (result: any): void => {
        console.debug("Task completed:", result);
    };
};