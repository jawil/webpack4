import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Test } from 'components/test/Test';
import { AppContainer } from 'react-hot-loader';


if ((module as any).hot) {
  (module as any).hot.accept(() => {
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
