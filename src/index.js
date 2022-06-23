import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';
import { createRoot } from 'react-dom/client';
const CounterOuter = () => {
    const [number, setNumber] = useState(0);
    console.log('App render', number);
    return <div onClick={() => {
        setNumber(2);
        setNumber(3);
    }}>
        {number}
    </div>
};
const App = () => {
    // debugger
    const [number1, setNumber1] = useState(0);
    // debugger
    // const [number2, setNumber2] = useState(1);
    console.log('render');
    useEffect(() => {
        setTimeout(() => {
            setNumber1('setNumber1第1次');
            // debugger;
            setNumber1('setNumber1第2次');
        }, 1000)
    }, []);
    return <div>
        <button onClick={() => {
            setTimeout(() => {
                setNumber1('setNumber1第1次');
                // debugger;
                setNumber1('setNumber1第2次');
            }, 1000)

        }}>{number1}</button>
        {/* <button onClick={() => {
            debugger;
            setNumber2('setNumber2第1次');
        }}>{number2}</button> */}
        {/* <CounterOuter /> */}
        {/* <Counter /> */}
    </div>
};
// let element = Counter();
// let CounterFiber = {
//     tag: IndeterminateComponent, //Fiber的类型
//     type: Counter, //此组件的具体类型是哪个组件
//     alternate: null  //上一个渲染的fiber
// }
// window.CounterFiber = CounterFiber;
// ReactDOM.render(<App />, document.getElementById('root'));
// render(CounterFiber);

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<App />);
ReactDOM.render(<App />, document.getElementById('root'));
