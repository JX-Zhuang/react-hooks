import React, { useEffect } from "react";

export const Parent = (props) => {
    console.log('render parent:', props.index);
    useEffect(() => {
        console.log('didmount parent:', props.index);
    }, [props.index]);
    return <div>
        Parent {props.index}
        {/* <Child index={`${props.index},1`} /> */}
        {/* <Child index={`${props.index},2`} /> */}
    </div>
};
export const Child = (props) => {
    console.log('render child:', props.index);
    useEffect(() => {
        console.log('didmount child', props.index);
    }, [props.index]);
    return <div>
        Child {props.index}
    </div>
};