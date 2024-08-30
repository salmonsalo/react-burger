import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsApi } from './burger-ingedients/api';
import { constructorReducer } from './burger-constructor/constructorSlice';
import { ingredientReducer } from './burger-ingedients/ingredientModalSlice';
import { apiServise } from '../utils/api';
import { ordersApi } from './middleware/websocket-api';


export const rootReducer = combineReducers({
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
    constructorSlice: constructorReducer, 
    ingredientModalSlice: ingredientReducer,
    [apiServise.reducerPath]: apiServise.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
})