import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ingredientModal: null,
};

const ingredientModalSlice = createSlice({
    name: 'ingredientModalSlice',
    initialState,
    reducers: {
        openModalIngredient : (state, action) => {
            state.ingredientModal = action.payload;
        },
        closeModalIngredient : (state) => {
            state.ingredientModal = null
        }
    }
})

export const { openModalIngredient, closeModalIngredient } = ingredientModalSlice.actions;
export const ingredientReducer = ingredientModalSlice.reducer;