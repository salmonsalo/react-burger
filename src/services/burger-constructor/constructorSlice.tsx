import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../burger-ingedients/api";

export interface IIngredientWithOriginalId extends IIngredient {
  uniqueId: string;
}

interface IConstructorState {
  bun: IIngredient | null;
  ingredients: (IIngredient | IIngredientWithOriginalId)[];
}

const initialState = {
  bun: null,
  ingredients: [],
};
const constructorSlice = createSlice({
  name: "constructorSlice",
  initialState,
  reducers: {
    addIngredients: (
      state: IConstructorState,
      action: PayloadAction<IIngredient>
    ) => {
      state.ingredients.push(action.payload);
    },
    removeIngredients: (state, action) => {
      const index = action.payload;
      state.ingredients.splice(index, 1);
    },
    updateBun: (state, action) => {
      state.bun = action.payload;
    },
    moveIngredient: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedIngredient] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedIngredient);
      state.ingredients = ingredients;
    },
    clearCart(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  addIngredients,
  removeIngredients,
  updateBun,
  moveIngredient,
  clearCart,
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
