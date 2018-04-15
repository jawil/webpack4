import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import Test from './Test.jsx';

if (module.hot) {
  module.hot.accept(() => {
    console.log(222);
    ReactDOM.render(
      <AppContainer>
        <Test />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

ReactDOM.render(
  <AppContainer>
    <Test />
  </AppContainer>,
  document.getElementById('root')
);
