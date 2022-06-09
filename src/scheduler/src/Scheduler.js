import { requestHostCallback, shouldYieldToHost as shouldYield } from './SchedulerHostConfig';
let taskQueue = [];
let currentTask = null;
/**
 * 调度一个工作
 * @param {*} callback 要执行的工作
 */
function scheduleCallback(callback) {
    taskQueue.push(callback);
    requestHostCallback(flushWork);
}
function flushWork() {
    return workLoop();
}
function workLoop() {
    currentTask = taskQueue[0];
    while (currentTask) {
        if (shouldYield()) {
            break;
        }
        const continuationCallback = currentTask();
        if (typeof continuationCallback === 'function') {
            currentTask = continuationCallback;
        } else {
            taskQueue.shift();
        }
        currentTask = taskQueue[0];
    }
    return currentTask;
}

export {
    scheduleCallback,
    shouldYield
}