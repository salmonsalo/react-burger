import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    ingredientModal: null,
};

const ingredientModalSlice = createSlice({
    name: 'ingredientModalSlice',
    initialState,
    reducers: {
        openModalIngredient : (state, action) => {
            state.ingredientModal = action.payload;
        },
    }
})

export const { openModalIngredient} = ingredientModalSlice.actions;
export const ingredientReducer = ingredientModalSlice.reducer;
export default ingredientModalSlice;