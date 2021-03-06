# React
## 虚拟dom
* 描述真实dom的js对象
## Fiber
* 为了可以让渲染中断，把整个渲染拆分成多个工作单元，每个单元就是一个Fiber
* 每个虚拟dom表示成一个Fiber对象
* render阶段会把虚拟dom以深度优先的方式构建Fiber树
* 深度优先遍历：beginWork构建，该节点完成时执行completeUnitOfWork
## EffectList
* 副作用链表，表示对dom的增、删、改
* 在complete阶段收集副作用链表
* 在commit阶段处理副作用链表，即更新到dom中
* 注意：dom-diff时，如果是删除Fiber，会把改变链表，把删除操作放在链表最前面 
## dom-diff
* dom-diff是老Fiber节点和新虚拟dom的对比
* 如果没有老Fiber，新建Fiber
### 原则
* 只对同级元素对比
* 不同类型对应不同元素
* 可以用key识别同一个节点
### 新节点是单个节点
* 对比key，如果不同，继续查找其他Fiber
* 对比key，如果相同
    * 对比type，如果type不同，删除当前Fiber以及所有兄弟Fiber，新建Fiber并返回
    * 对比type，如果type相同，删除剩余Fiber，复用老Fiber并返回
### 新节点是数组
* 第一次遍历
    * 如果key不同，直接结束本轮循环
    * 如果新老都遍历完，结束本轮循环
    * 如果key相同，type不同，标记老Fiber为删除，继续遍历
    * 如果key相同，type相同，复用老Fiber，继续遍历
* 第二次遍历
    * 如果新的遍历完，老的没有遍历完，把老的标记为删除，diff结束
    * 如果老的遍历完，新的没有遍历完，把新的标记为新增，diff结束
    * 新的和老的都遍历完，diff结束
    * 新的和老的都没有遍历完，进行移动的逻辑
* 第三次遍历
    * 处理节点移动的逻辑
    * 把老Fiber放在map里
    * 遍历新节点
        * 如果map里有，复用老Fiber。如果老Fiber的索引，比该Fiber在新节点的位置索引大，标记为移动。在map里删除改Fiber；
        * 如果map里没有，标记为新增
    * 循环完把map里剩余的Fiber标记为删除
## 事件模型
* 事件委托到根组件
* 冒泡、捕获
## Hooks
* fiber.memoizedState指向一个单向链表，里面存储hook对象
* hook.queue.pending指向一个循环链表，里面存储update对象
    * queue.pending，始终指向最新的update
    * 新来的update，添加到循环链表的队尾
* 连续调用两次useState，只更新一次
    * 调用时，都会放在memoizedState里，但是会把之后的update.eager是false
    * 在渲染时，获取state时，返回最后的state
* 连续调用两次useState，只渲染一次
    * 如果有正在进行中的task，会复用，不会继续执行
* 如果在setTimeout里连续调用两次useState
    * React17，会渲染多次
    * React18，只渲染一次，批量更新
## 时间分片
* 浏览器每秒刷新60帧，每16.67ms刷新一次。
* JS的执行，会堵塞浏览器渲染。如果JS执行时间很长，浏览器渲染会卡住
* `requestIdleCallback`浏览器兼容不好
* 基于以上原因，React使用[MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)实现时间分片。
* `MessageChannel`是一个宏任务
* 多任务调度，使用队列存储
* 任务优先级
    * 不同的任务优先级不一样，过期时间不一样
    * 使用小顶堆存储任务
* 延迟任务