import { HostComponent, HostRoot } from './ReactWorkTags';
import { appendChild, removeChild, insertBefore } from './ReactDOMHostConfig';
import { updateProperties } from './ReactDOMComponent';
import { Placement } from './ReactFiberFlags';

function getParentStateNode(fiber) {
    const parent = fiber.return;
    do {
        if (parent.tag === HostComponent) {
            return parent.stateNode;
        } else if (parent.tag === HostRoot) {
            return parent.stateNode.containerInfo;
        } else {
            //函数组件或类组件
            parent = parent.return;
        }
    } while (parent);
}
/**
 * 插入节点
 * @param {*} nextEffect 
 */
export function commitPlacement(nextEffect) {
    let stateNode = nextEffect.stateNode;
    let parentStateNode = getParentStateNode(nextEffect);
    let before = getHostSibling(nextEffect);
    if (before) {
        insertBefore(parentStateNode, stateNode, before);
    } else {
        appendChild(parentStateNode, stateNode);
    }
}
//当前fiber后面一个离它最近的真实的DOM节点
function getHostSibling(fiber) {
    let node = fiber.sibling;
    while (node) {
        //找它的弟弟们，找到最近一个，不是插入的节点，返回。。没有更新，更新
        if (!(node.flags & Placement)) {
            return node.stateNode;
        }
        node = node.sibling;
    }
    return null;
}

/**
 * 提交DOM更新操作
 * @param {*} current 
 * @param {*} finishedWork 
 */
export function commitWork(current, finishedWork) {
    const updatePayload = finishedWork.updateQueue;
    finishedWork.updateQueue = null;
    if (updatePayload) {
        updateProperties(finishedWork.stateNode, updatePayload);
    }
}

export function commitDeletion(fiber) {
    if (!fiber) return;
    let parentStateNode = getParentStateNode(fiber);
    removeChild(parentStateNode, fiber.stateNode);
}