
import { HostRoot, HostComponent, FunctionComponent, IndeterminateComponent } from './ReactWorkTags';
import { reconcileChildFibers, mountChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from './ReactDOMHostConfig';
import { renderWithHooks } from './ReactFiberHooks';

/**
 * 创建当前fiber的子fiber
 */
export function beginWork(current, workInProgress) {
    debugger
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress);
        case HostComponent:
            return updateHostComponent(current, workInProgress);
        default:
            break;
    }
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
/**
 * 更新或者说挂载根节点
 * 依据什么构建fiber树？ 虚拟DOM
 * @param {*} current 老fiber
 * @param {*} workInProgress 构建中的新fiber
 */
function updateHostRoot(current, workInProgress) {
    const updateQueue = workInProgress.updateQueue;
    //获取要渲染的虚拟DOM <div key="title" id="title">title</div>
    const nextChildren = updateQueue.shared.pending.payload.element;//element 
    //处理子节点，根据老fiber和新的虚拟DOM进行对比，创建新的fiber树
    reconcileChildren(current, workInProgress, nextChildren);
    //返回第一个子fiber
    return workInProgress.child;
}
function updateHostComponent(current, workInProgress) {
    //获取 此原生组件的类型 span p
    const type = workInProgress.type;
    //新属性
    const nextProps = workInProgress.pendingProps;//props.children
    let nextChildren = nextProps.children;
    //在react对于如果一个原生组件，它只有一个儿子，并且这个儿子是一个字符串的话，有一个优化
    //不会对此儿子创建一个fiber节点，而是把它当成一个属性来处理
    let isDirectTextChild = shouldSetTextContent(type, nextProps);
    if (isDirectTextChild) {
        nextChildren = null;
    }
    //处理子节点，根据老fiber和新的虚拟DOM进行对比，创建新的fiber树
    reconcileChildren(current, workInProgress, nextChildren);
    //返回第一个子fiber
    return workInProgress.child;
}
export function reconcileChildren(current, workInProgress, nextChildren) {
    //如果current有值，说明这是一类似于更新的作品
    if (current) {
        //进行比较 新老内容，得到差异进行更新
        workInProgress.child = reconcileChildFibers(
            workInProgress,//新fiber
            current.child,//老fiber的第一个子fiber节点
            nextChildren //新的虚拟DOM
        );
    } else {
        ///初次渲染，不需要比较 ，全是新的
        workInProgress.child = mountChildFibers(
            workInProgress,//新fiber
            null,//老fiber的第一个子fiber节点
            nextChildren //新的虚拟DOM
        );
    }
}