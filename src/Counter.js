import * as React from 'react';
// import * as ReactDOM from 'react-dom';
class Counter extends React.Component {
    state = { number: 0 }
    onClick = () => {
        console.log('buttonClick');
        this.setState({ number: 2 });
        console.log('Counter', this.state.number);
        this.setState({ number: 3 });
        console.log('Counter', this.state.number);
        // setTimeout(() => {
        //     this.setState({ number: this.state.number + 1 });
        //     console.log('setTimeout', this.state.number);
        //     this.setState({ number: this.state.number + 1 });
        //     console.log('setTimeout', this.state.number);
        // },1000);
    }
    render() {
        console.log('Counter render', this.state.number);
        return (
            <div onClick={this.divClick} id="counter">
                <p>{this.state.number}</p>
                <button onClick={this.onClick}>+</button>
            </div>
        )
    }
}
export default Counter;