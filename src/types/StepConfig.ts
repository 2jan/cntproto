export type StepResultCollector<result> = (data: Map<string, result>) => result;

export interface StepConfig {
    name: string;
    tasks: Array<CallableFunction>;
    prepareResult?: StepResultCollector<any>;
};