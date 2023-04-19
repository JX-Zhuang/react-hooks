import { scheduleCallback, shouldYield } from "./scheduler";
let result = 0;
let i = 0;
/**
 * 总任务
 * @returns 
 */
function calculate() {
    for (; i < 100000 && (!shouldYield()); i++) {//7个0
        result += 1;
    }
    if (result < 100000) {
        return calculate;
    } else {
        console.log('result', result);
        return null;
    }
}
let result2 = 0;
let i2 = 0;
/**
 * 总任务
 * @returns 
 */
function calculate2() {
    for (; i2 < 1000000 && (!shouldYield()); i2++) {
        result2 += 1;
    }
    if (result2 < 1000000) {
        return calculate;
    } else {
        console.log('result2', result2);
        return null;
    }
}
scheduleCallback(calculate);
scheduleCallback(calculate2);