import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';
let ReactCurrentDispatcher = {
    current: null
};
let workInProgressHook = null;  //当前的新hook
let currentHook = null; //当前的老hook
let currentlyRenderingFiber;//当前正在使用的fiber
//初次挂载
const HookDispatcherOnMount = {
    useReducer: mountReducer,
    useState: mountState
};
//更新
const HookDispatcherOnUpdate = {
    useReducer: updateReducer,
    useState: updateState
};
function basicStateReducer(state, action) {
    return typeof action === 'function' ? action(state) : action;
}
function mountState(initialState) {
    const hook = mountWorkInProgressHook();
    hook.memoizedState = initialState;
    const queue = (hook.queue = {
        pending: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
    });
    const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch];
}
function updateState(initialState) {
    return updateReducer(basicStateReducer, initialState);
}
function updateReducer(reducer, initialArg) {
    let hook = updateWorkInProgressHook();
    const queue = hook.queue;//更新队列
    let lastRenderedReducer = queue.lastRenderedReducer;
    let current = currentHook;
    const pendingQueue = queue.pending;//update的环状链表
    if (pendingQueue !== null) {
        //更新，根据老的状态和更新队列里的更新对象计算新的状态
        let first = pendingQueue.next;//第一个更新对象
        let newState = current.memoizedState;//老状态
        let update = first;
        do {
            const action = update.action;// {type:'add'}
            newState = reducer(newState, action);
            update = update.next;
        } while (update !== null && update !== first);
        queue.pending = null;//更新过了，清空环形链表
        hook.memoizedState = newState;//新的hook对象的memoizedState等于新状态
        queue.lastRenderedState = newState;//把新状态赋值给lastRenderedState
    }
    const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch];
}
/**
 * 取到当前新的hook对应的老hook
 */
function updateWorkInProgressHook() {
    let nextCurrentHook;//current->老的，workInProgress->新的
    if (currentHook === null) {//说明这个是第一个hook
        //老的Counter Fiber
        let current = currentlyRenderingFiber.alternate;
        //老的fiber的memoizedState指向老的hook链表的第一个节点
        nextCurrentHook = current.memoizedState;
    } else {
        nextCurrentHook = currentHook.next;
    }
    currentHook = nextCurrentHook;
    //创建新的hook对象
    const newHook = {
        memoizedState: currentHook.memoizedState,
        queue: currentHook.queue,
        next: null
    };
    if (workInProgressHook === null) {//第一个hook
        currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
        workInProgressHook = workInProgressHook.next = newHook;
    }
    return workInProgressHook;
}
//不同的阶段，useReducer有不同的实现
export function renderWithHooks(current, workInProgress, Component) {
    currentlyRenderingFiber = workInProgress;
    currentlyRenderingFiber.memoizedState = null;//在执行组件方法之前，要清空hook链表，要创建新的hook链表
    if (current !== null) {
        //更新阶段
        ReactCurrentDispatcher.current = HookDispatcherOnUpdate;
    } else {
        //初次挂载
        ReactCurrentDispatcher.current = HookDispatcherOnMount;
    }
    let children = Component(); //Counter组件渲染方法
    currentlyRenderingFiber = null;
    workInProgressHook = null;
    currentHook = null;
    return children;
}
function mountReducer(reducer, initialArg) {
    //构建hooks单向链表
    let hook = mountWorkInProgressHook();
    hook.memoizedState = initialArg;
    const queue = (hook.queue = { pending: null });//更新队列
    const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch];
}
function dispatchAction(currentlyRenderingFiber, queue, action) {
    // 构建update对象
    const update = { action, next: null };
    const pending = queue.pending;
    if (pending === null) {
        //自己和自己构成一个循环链表，环状链表
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    queue.pending = update;
    const lastRenderedReducer = queue.lastRenderedReducer;
    const lastRenderedState = queue.lastRenderedState;
    let eagerState = lastRenderedReducer(lastRenderedState, action);
    update.eagerState = lastRenderedReducer;
    update.eagerState = eagerState;
    if (Object.is(eagerState, lastRenderedState)) {
        return;
    }
    console.log('queue.pending', queue.pending);
    scheduleUpdateOnFiber(currentlyRenderingFiber);
}
function mountWorkInProgressHook() {
    let hook = {
        memoizedState: null,    //自己的状态
        queue: null,            //自己的更新队列，环形链表
        next: null              //下一个更新
    };
    // 说明这是第一个hook
    if (workInProgressHook === null) {
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}

export function useReducer(reducer, initialArg) {
    return ReactCurrentDispatcher.current.useReducer(reducer, initialArg);
}

export function useState(initialState) {
    return ReactCurrentDispatcher.current.useState(initialState);
}