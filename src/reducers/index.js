// Reducers

import { combineReducers } from 'redux';

const comicsReducer = (cache=[], action) => {
  return cache;
}

export default combineReducers({
  comics: comicsReducer
});