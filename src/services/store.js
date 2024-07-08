import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { ingredientsApi } from './burger-ingedients/api';
import { apiServise } from '../utils/api';

export const store = configureStore({
  reducer : rootReducer,
  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware()
    .concat(ingredientsApi.middleware)
    .concat(apiServise.middleware)
  }
});