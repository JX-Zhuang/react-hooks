import { HostComponent } from "./ReactWorkTags";
import { appendChild, createInstance, finalizeInitialChildren, prepareUpdate } from './ReactDOMHostConfig';
import { Update } from "./ReactFiberFlags";

export function completeWork(current, workInProgress) {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case HostComponent:
            //在新的fiber构建完成的时候，收集更新并且标识 更新副作用
            if (current && workInProgress.stateNode) {
                updateHostComponent(current, workInProgress, workInProgress.tag, newProps);
            } else {
                //创建真实的DOM节点
                const type = workInProgress.type;//div p span
                //创建此fiber的真实DOM
                const instance = createInstance(type, newProps);
                appendAllChildren(instance, workInProgress);
                //让此Fiber的真实DOM属性指向instance
                workInProgress.stateNode = instance;
                //给真实DOM添加属性 包括如果独生子是字符串或数字的情况
                finalizeInitialChildren(instance, type, newProps);
            }
            break;
        default:
            break;
    }
}
function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child;
    while (node) {
        if (node.tag === HostComponent) {
            //把大儿子的真实DOM节点添加到父真实DOM上
            appendChild(parent, node.stateNode);
        }
        node = node.sibling;
    }
}
/**
 * 
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} tag 
 * @param {*} newProps 新的虚拟DOM上的新属性
 */
function updateHostComponent(current, workInProgress, tag, newProps) {
    //老fiber上的老属性
    let oldProps = current.memoizedProps;
    //可复用真实的DOM节点
    const instance = workInProgress.stateNode;
    const updatePayload = prepareUpdate(instance, tag, oldProps, newProps);
    workInProgress.updateQueue = updatePayload;
    if (updatePayload) {
        //如果原来是0，变是4 100，如果原来是2 010，变 成110
        workInProgress.flags |= Update;
        //当flags=6的话，就是既要插入新位置 ，又要更新，针对移动 节点的情况
    }
}
/**
 * 根fiber rootFiber updateQueue 上面是一个环状链表 update {payload:element}
 * 原生组件fiber  HostComponent updateQueue=updatePayload 数组 [key1,value1,key2,value2]
 *
 */