const channel = new MessageChannel();
channel.port1.onmessage = performWorkUntilDeadline;
let deadline = 0;
let yieldInterval = 5;
let scheduledHostCallback = null;
/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getCurrentTime() {
    return performance.now();
}

export function requestHostCallback(callback) {
    scheduledHostCallback = callback;
    channel.port2.postMessage(null);
}

export function shouldYieldToHost() {
    return getCurrentTime() >= deadline;
}
function performWorkUntilDeadline() {
    deadline = getCurrentTime() + yieldInterval;
    const hasWork = scheduledHostCallback();
    if (hasWork) {
        channel.port2.postMessage(null);
    }
}