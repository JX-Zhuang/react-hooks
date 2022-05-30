import { beginWork } from './ReactFiberBeginWork';
let workInProgress = null;
function workLoop() {
    while (workInProgress) {
        workInProgress = performUnitOfWork(workInProgress);
    }
}
//每一个fiber都是一个工作单元
function performUnitOfWork(unitOfWork) {
    let current = unitOfWork.alternate;//更新的时候有替身
    return beginWork(current, unitOfWork);
}
export function render(fiber) {
    workInProgress = fiber;
    workLoop();
}
/**
 * 
 * @param {*} oldFiber current Fiber 当前正在渲染的fiber
 */
export function scheduleUpdateOnFiber(oldFiber){
    let newFiber = {
        ...oldFiber,
        alternate:oldFiber
    };
    workInProgress = newFiber;
    workLoop();
}