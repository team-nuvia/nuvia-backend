import { parentPort, workerData } from 'worker_threads';

const { data } = workerData;
parentPort?.postMessage(data + ' world!');
