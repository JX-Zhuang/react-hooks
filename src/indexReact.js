import React from './react';
import ReactDOM from './react-dom';
//1. key相同,类型相同,复用老节点，只更新属性
single1.addEventListener('click', () => {
    let element = (
        <div key="title" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single1Update.addEventListener('click', () => {
    let element = (
        <div key="title" id="title2">title2</div>
    );
    ReactDOM.render(element, root);
});

//2.key相同,类型不同，删除老节点，添加新节点
single2.addEventListener('click', () => {
    let element = (
        <div key="title" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single2Update.addEventListener('click', () => {
    let element = (
        <p key="title" id="title">title</p>
    );
    ReactDOM.render(element, root);
});
//3.类型相同,key不同,删除老节点，添加新节点
single3.addEventListener('click', () => {
    let element = (
        <div key="title1" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single3Update.addEventListener('click', () => {
    let element = (
        <div key="title2" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
//4.原来多个节点，现在只有一个节点,删除多余节点
single4.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B">B</li>
            <li key="C">C</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
single4Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="B" id="B2">B2</li>
        </ul>
    );
    ReactDOM.render(element, root);
});

//多节点diff
//5.多个节点的数量、类型和key全部相同，只更新属性
multi1.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B">B</li>
            <li key="C" id="C">C</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
multi1Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <p key="B" id="B2">B2</p>
            <li key="C" id="C2">C2</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
//6.多个节点的类型和key全部相同，有新增元素
multi2.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B">B</li>
            <li key="C">C</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
//增加新元素并更新老元素
multi2Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B2">B2</li>
            <li key="C">C</li>
            <li key="D">D</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
//7.多个节点的类型和key全部相同，有删除老元素
multi3.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B">B</li>
            <li key="C">C</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
multi3Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B2">B2</li>
        </ul>
    );
    ReactDOM.render(element, root);
});

//9.多个节点数量不同、key不同
multi5.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="b">B</li>
            <li key="C">C</li>
            <li key="D">D</li>
            <li key="E">E</li>
            <li key="F">F</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
multi5Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="C">C</li>
            <li key="E">E</li>
            <li key="B" id="b2">B2</li>
            <li key="G">G</li>
            <li key="D">D</li>
        </ul>
    );
    ReactDOM.render(element, root);
});