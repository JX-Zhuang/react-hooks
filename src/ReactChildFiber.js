import { REACT_ELEMENT_TYPE } from "./ReactSymbols";
import { createFiberFromElement, createWorkInProgress } from './ReactFiber';
import { Placement, Deletion } from './ReactFiberFlags';

function childReconciler(shouldTrackSideEffects) {
    /**
     * 因为这个老的子fiber在新的虚拟DOM树不存在了，则标记为删除
     * @param {*} returnFiber 
     * @param {*} childToDelete 
     */
    function deleteChild(returnFiber, childToDelete) {
        //如果不需要跟踪副作用，直接返回
        if (!shouldTrackSideEffects) {
            return;
        }
        //把自己这个副作用添加到父effectList中
        //删除类型的副作用一般放在父fiber副作用链表的前面，在进行DOM操作时候先执行删除操作
        const lastEffect = returnFiber.lastEffect;
        debugger
        if (lastEffect) {
            lastEffect.nextEffect = childToDelete;
            returnFiber.lastEffect = childToDelete;
        } else {
            //父fiber节点effectList是空
            returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
        }
        //清空下一个副作用指向
        childToDelete.nextEffect = null;
        //标记为删除
        childToDelete.flags = Deletion;
    }
    function deleteRemainingChildren(returnFiber, childToDelete) {
        while (childToDelete) {
            deleteChild(returnFiber, childToDelete);
            childToDelete = childToDelete.sibling;
        }
    }
    function useFiber(oldFiber, pendingProps) {
        let clone = createWorkInProgress(oldFiber, pendingProps);
        //clone.index = 0;//此fiber挂载的索引清空，这个我现在还没用到
        clone.sibling = null;//清空弟弟 
        return clone;
    }
    /**
     * 协调单节点
     * @param {*} returnFiber  新的父fiber
     * @param {*} currentFirstChild 第一个旧fiber
     * @param {*} element 新的要渲染的虚拟DOM是一个原生DOM节点
     * @returns 
     */
    function reconcileSingleElement(returnFiber, currentFirstChild, element) {
        //获取新的虚拟DOM的key
        let key = element.key;
        //获取第一个老的fiber节点
        let child = currentFirstChild;
        debugger
        while (child) {
            //老fiber的ekey和新的虚拟DOM的key相同说明
            if (child.key === key) {
                //判断老的fiber的type和新的虚拟DOMtype是否相同
                if (child.type == element.type) {
                    //准备复用child老fiber节点，删除剩下的其它fiber
                    deleteRemainingChildren(returnFiber, child.sibling);
                    //在复用老fiber的时候，会传递新的虚拟DOM的属性对象到新fiber的pendingProps上
                    const existing = useFiber(child, element.props);
                    existing.return = returnFiber;
                    return existing;
                } else {
                    //已经配上key了，但是type不同，则删除包括当前的老fiber在内所所有后续的老fibe
                    deleteRemainingChildren(returnFiber, child);
                    break;
                }
            } else {
                debugger
                //如果相同说明当前这个老fiber不是对应于新的虚拟DOM节点 把此老fiber标记为删除，并且继续弟弟
                deleteChild(returnFiber, child);
            }
            //继续匹配弟弟们
            child = child.sibling;
        }
        const created = createFiberFromElement(element);//div#title
        created.return = returnFiber;
        return created;
    }
    function placeSingleChild(newFiber) {
        //如果当前需要跟踪父作用，并且当前这个新的fiber它的替身不存在
        if (shouldTrackSideEffects && !newFiber.alternate) {
            //给这个新fiber添加一个副作用，表示在未来提前阶段的DOM操作中会向真实DOM树中添加此节点
            newFiber.flags = Placement;
        }
        return newFiber;
    }
    function createChild(returnFiber, newChild) {
        const created = createFiberFromElement(newChild);
        created.return = returnFiber;
        return created;
    }
    function updateElement(returnFiber, oldFiber, newChild) {
        if (oldFiber) {
            if (oldFiber.type === newChild.type) {
                const existing = useFiber(oldFiber, newChild.props);
                existing.return = returnFiber;
                return existing;
            }
        }
        //如果没有老fiber
        const created = createFiberFromElement(newChild);
        created.return = returnFiber;
        return created;
    }
    function updateSlot(returnFiber, oldFiber, newChild) {
        const key = oldFiber ? oldFiber.key : null;
        //如果新的虚拟DOM的key和老fiber的key一样
        if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
        } else {
            //如果key不一样，直接结束返回null
            return null;
        }
    }
    function placeChild(newFiber, lastPlacedIndex, newIdx) {
        newFiber.index = newIdx;
        if (!shouldTrackSideEffects) {
            return lastPlacedIndex;
        }
        const current = newFiber.alternate;
        //如果有current说是更新，复用老节点的更新，不会添加Placement
        if (current) {
            const oldIndex = current.index;
            //如果老fiber它对应的真实DOM挂载的索引比lastPlacedIndex小
            if (oldIndex < lastPlacedIndex) {
                //老fiber对应的真实DOM就需要移动了
                newFiber.flags |= Placement;
                return lastPlacedIndex;
            } else {
                //否则 不需要移动 并且把老fiber它的原来的挂载索引返回成为新的lastPlacedIndex
                return oldIndex;
            }
        } else {
            newFiber.flags = Placement;
            return lastPlacedIndex;
        }
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
        const matchedFiber = existingChildren.get(newChild.key || newIdx);
        return updateElement(returnFiber, matchedFiber, newChild);
    }
    /**
     * 如果新的虚拟DOM是一个数组的话， 也就是说有多个儿子的话
     * @param {*} returnFiber ui
     * @param {*} currentFirstChild null 
     * @param {*} newChild [liA,liB,liC]
     */
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
        //将要返回的第一个新fiber
        let resultingFirstChild = null;
        //上一个新fiber
        let previousNewFiber = null;
        //当前的老fiber
        let oldFiber = currentFirstChild;
        //下一个老fiber
        let nextOldFiber = null;
        //新的虚拟DOM的索引
        let newIdx = 0;
        //指的上一个可以复用的，不需要移动的节点的老索引
        let lastPlacedIndex = 0;
        //处理更新的情况 老fiber和新fiber都存在
        for (; oldFiber && newIdx < newChildren.length; newIdx++) {
            //先缓存下一个老fiber
            nextOldFiber = oldFiber.sibling;
            //试图复用才fiber
            const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
            //如果key 不一样，直接跳出第一轮循环
            if (!newFiber)
                break; //跳出第一轮循环
            //老fiber存在，但是新的fiber并没有复用老fiber
            if (oldFiber && !newFiber.alternate) {
                deleteChild(returnFiber, oldFiber);
            }
            //核心是给当前的newFiber添加一个副作用flags 叫新增
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (!previousNewFiber) {
                resultingFirstChild = newFiber;//resultingFirstChild=>li(A)
            } else {
                previousNewFiber.sibling = newFiber;//liB.sibling=li(C)
            }
            previousNewFiber = newFiber;//previousNewFiber=>li(C)
            oldFiber = nextOldFiber;
        }

        if (newIdx === newChildren.length) {//1!=6
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
        }
        //如果没有老fiber了
        if (!oldFiber) { //oldFIber现在指向B，有的，进不出
            //循环虚拟DOM数组， 为每个虚拟DOM创建一个新的fiber
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx]);//li(C)
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;//resultingFirstChild=>li(A)
                } else {
                    previousNewFiber.sibling = newFiber;//liB.sibling=li(C)
                }
                previousNewFiber = newFiber;//previousNewFiber=>li(C)
            }
            return resultingFirstChild;
        }
        //将剩下的老fiber放入map中
        const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
        for (; newIdx < newChildren.length; newIdx++) {
            //去map中找找有没key相同并且类型相同可以复用的老fiber 老真实DOM
            const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
            if (newFiber) {
                //说明是复用的老fiber
                if (newFiber.alternate) {
                    existingChildren.delete(newFiber.key || newIdx);
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;//resultingFirstChild=>li(A)
                } else {
                    previousNewFiber.sibling = newFiber;//liB.sibling=li(C)
                }
                previousNewFiber = newFiber;//previousNewFiber=>li(C)
            }
        }
        //map中剩下是没有被 复用的，全部删除
        existingChildren.forEach(child => deleteChild(returnFiber, child));
        return resultingFirstChild;

    }
    function mapRemainingChildren(returnFiber, currentFirstChild) {
        const existingChildren = new Map();
        let existingChild = currentFirstChild;
        while (existingChild) {
            let key = existingChild.key || existingChild.index;
            existingChildren.set(key, existingChild)
            existingChild = existingChild.sibling;
        }
        return existingChildren;
    }
    /**
     * 
     * @param {*} returnFiber 新的父fiber
     * @param {*} currentFirstChild current就是老的意思，老的第一个子fiber
     * @param {*} newChild 新的虚拟DOM
     */
    function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
        //判断newChild是不是一个对象,如果是的话说明新的虚拟DOM只有一个React元素节点
        const isObject = typeof newChild === 'object' && (newChild);
        //说明新的虚拟DOM是单节点
        if (isObject) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(
                        returnFiber, currentFirstChild, newChild
                    ));
            }
        }
        if (Array.isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
        }
    }
    return reconcileChildFibers;
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);