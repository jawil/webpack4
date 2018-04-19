import * as React from 'react';
import './test.scss';
import { autobind } from 'core-decorators';

@autobind
class Test extends React.Component {
  public state;
  constructor(props) {
    super(props);
    this.state = {
      name: 'jawil'
    };
  }

  showInfo() {
    console.log(this.state.name);
    function show(a: number, b: string) {
      console.log(12211);
      return a + b;
    }

    show(1, '1111');
  }

  render() {
    return (
      <div className="wrap" style={{ border: '1px solid green' }} onClick={this.showInfo}>
        <span className="test">{this.state.name}</span>
      </div>
    );
  }
}

export { Test };
