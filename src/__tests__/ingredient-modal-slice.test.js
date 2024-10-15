import {
  ingredientReducer,
  openModalIngredient,
  initialState,
} from "../services/burger-ingedients/ingredientModalSlice";

describe("ingredientModalSlice", () => {
  it("should return the initial state", () => {
    expect(ingredientReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle openModalIngredient", () => {
    const ingredient = {
      _id: "643d69a5c3f7b9001cfa093c",
      name: "Краторная булка N-200i",
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
    };
    const expectedState = { ingredientModal: ingredient };
    const action = openModalIngredient(ingredient);
    const state = ingredientReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });
});
