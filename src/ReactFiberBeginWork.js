import { FunctionComponent, HostComponent, IndeterminateComponent } from './ReactWorkTags';
import { renderWithHooks } from './ReactFiberHooks';
/**
 * 更新还是初次渲染
 * @param {*} current 上一个fiber 初始挂载为null
 * @param {*} workInProgress 这一次正在构建的fiber
 */
export function beginWork(current, workInProgress) {
    if (current) {
        // 有current说明是更新
        switch (workInProgress.tag) {
            case FunctionComponent:
                return updateFunctionComponent(
                    current,
                    workInProgress,
                    workInProgress.type //Counter组件
                );
            default:
                break;
        }
    } else {
        switch (workInProgress.tag) {
            case IndeterminateComponent:
                return mountIndeterminateComponent(
                    current,
                    workInProgress,
                    workInProgress.type //Counter组件
                );
            default:
                break;
        }
    }
}
function updateFunctionComponent(current, workInProgress, Component) {
    // children就是Counter组件函数的返回值
    let newChildren = renderWithHooks(
        current,
        workInProgress,
        Component
    );
    window.counter = newChildren;
    console.log('newChildren', newChildren);
    // 构建虚拟DOM，构建Fiber子树
    reconcileChildren(current, workInProgress, newChildren);
    return workInProgress.child;
}
function mountIndeterminateComponent(current, workInProgress, Component) {
    // children就是Counter组件函数的返回值
    let children = renderWithHooks(
        current,
        workInProgress,
        Component
    );
    window.counter = children;
    console.log('children', children);
    workInProgress.tag = FunctionComponent;
    // 构建虚拟DOM，构建Fiber子树
    reconcileChildren(current, workInProgress, children);
    return workInProgress.child;
}
function reconcileChildren(current, workInProgress, children) {
    let childFiber = {
        tag: HostComponent,
        type: children.type, //div
    };
    workInProgress.child = childFiber;
}