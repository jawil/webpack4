import * as React from 'react';
import { autobind } from 'core-decorators';
import './test.scss';

@autobind
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'jawil'
    };
  }

  showInfo() {
    console.log(this.state.name);

    function show(a, b) {
      console.log(4444);
      return a + b;
    }

    show(1, '1111');
  }

  render() {
    return (
      <div className="wrap" style={{ border: '1px solid red' }} onClick={this.showInfo}>
        <span className="test">{this.state.name}</span>
      </div>
    );
  }
}

export default Test;
