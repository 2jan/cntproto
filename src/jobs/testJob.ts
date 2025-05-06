import { TestWorker } from "../workers/TestWorker";

const data = 7;
const testWorker = new TestWorker();
testWorker.run(data);
