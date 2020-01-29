// Actions

import marvel from './api/marvel';
import { /*CHARACTERS, SERIES, EVENT, CREATORS, */COMICS } from '../constants';

export const fetchComics = term => async dispatch => {
  const response = await marvel.get('/comics', {
    params: {
      titleStartsWith: term
    }
  });

  dispatch({
    type: 'FETCH_COMICS',
    payload: response.data
  });
}