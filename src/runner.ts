import { TaskProcessor } from "./types/TaskProcessor";
import { createTask } from "./tasks/createTask";

const testTask = (n: number) => {
    const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    };
    return fibonacci(n);
};

const testTask2 = (n: number) => {
    const factorial = (n: number): number => {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    };
    return factorial(n);
};

const task1 = createTask<number, number>(testTask);
const task2 = createTask<number, number>(testTask2);

const taskProcessor = new TaskProcessor();

taskProcessor.on("stepCreated", (step) => {
    console.debug("stepCreated:", step);
});
taskProcessor.on("stepStarted", (step) => {
    console.debug("stepStarted:", step);
});
taskProcessor.on("taskAdded", (data) => {
    console.debug("taskAdded:", data);
}
);
taskProcessor.on("taskStarted", (task) => {
    console.debug("taskStarted:", task);
}
);
taskProcessor.on("taskResult", (result) => {
    console.debug("taskResult:", result);
}
);
taskProcessor.on("stepCompleted", (result) => {
    console.debug("stepCompleted:", result);
}
);

const step1 = taskProcessor.createStep();
step1.addTask(task1);
step1.addTask(task2);
step1.run(10);