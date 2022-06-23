// import React,{useState} from 'react';
// import ReactDOM from 'react-dom';
import { IndeterminateComponent } from './ReactWorkTags';
import { render } from './ReactFiberWorkLoop';
import { useReducer, useState } from './ReactFiberHooks';
import React from './react';
import ReactDOM from './react-dom';
const reducer = (state, action) => {
    if (action.type === 'add') {
        return state + 1;
    }
    return state;
};
const Counter = () => {
    const [number, setNumber] = useState(0);
    console.log('Counter render', number);
    return <div onClick={() => {
        setNumber(2);
        setNumber(3);
    }}>
        {number}
    </div>
};
// let element = Counter();
// let CounterFiber = {
//     tag: IndeterminateComponent, //Fiber的类型
//     type: Counter, //此组件的具体类型是哪个组件
//     alternate: null  //上一个渲染的fiber
// }
// window.CounterFiber = CounterFiber;
ReactDOM.render(<Counter/>, document.getElementById('root'));
// render(CounterFiber);