export interface Worker {
    run<data>(data: data): void;
};