import { createElement, setInitialProperties, diffProperties } from "./ReactDOMComponent";

//如果儿子只是一个数字或者字符串，就设置它的文本内容就行。不需要创建子fiber节点
export function shouldSetTextContent(type, pendingProps) {
    return typeof pendingProps.children === 'string' || typeof pendingProps.children === 'number';
}
export function createInstance(type) {
    return createElement(type);
}

export function finalizeInitialChildren(domElement, type, props) {
    setInitialProperties(domElement, type, props);
}
//真实的DOM是需要放在这个文件里
export function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
}
export function insertBefore(parentInstance, child, before) {
    parentInstance.insertBefore(child, before);
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
    return diffProperties(
        domElement,
        type,
        oldProps,
        newProps
    );
}
export function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
}
