import { BaseWorker } from './BaseWorker';
import { StepConfig, StepResultCollector } from '../types/StepConfig';

export class TestWorker extends BaseWorker {
    
    public init(data: number): StepConfig[] {
        const collector1: StepResultCollector<number> = (res: Map<string, number>) => {
            return Array.from(res.values()).reduce((acc, val) => acc + val, 0);
        };

        return [
            {
                name: "Fibonacci",
                tasks: [
                    () => this.calculateFibonacci(data)
                ],
                prepareResult: collector1,
            },
            {
                name: "Factorial",
                tasks: [
                    (res) => this.calculateFactorial(res)
                ]
            }
        ];
    }

    private calculateFibonacci(n: number): number {
        console.log("Calculating Fibonacci for:", n);
        if (n <= 1) return n;
        return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
    }

    private calculateFactorial(n: number): number {
        console.log("Calculating Factorial for:");
        console.debug(n);
        if(typeof n !== 'number') {
            return 0;;
        }
        
        if (n <= 1) return 1;
        return n * this.calculateFactorial(n - 1);
    }
    
}