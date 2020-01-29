import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './component/App';
import reducer from './reducers';

import 'semantic-ui-less/semantic.less'
import '../src/index.css';

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <App />
  </Provider>, 
  document.getElementById('root')
);