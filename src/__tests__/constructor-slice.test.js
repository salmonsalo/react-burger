import {
  initialState,
  addIngredients,
  removeIngredients,
  updateBun,
  moveIngredient,
  clearCart,
  constructorReducer,
} from "../services/burger-constructor/constructorSlice";

describe("constructorSlice", () => {
  const ingredient = {
    _id: "643d69a5c3f7b9001cfa0942",
    name: "Соус Spicy-X",
    type: "sauce",
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: "https://code.s3.yandex.net/react/code/sauce-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/sauce-02-large.png",
  };

  const bun = {
    _id: "643d69a5c3f7b9001cfa093c",
    name: "Краторная булка N-200i",
    type: "bun",
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
  };

  it("should return the initial state", () => {
    expect(constructorReducer(undefined, { type: undefined })).toEqual(
      initialState
    );
  });

  it("should handle addIngredients", () => {
    const nextState = constructorReducer(
      initialState,
      addIngredients(ingredient)
    );
    expect(nextState.ingredients).toContain(ingredient);
  });

  it("should handle removeIngredients", () => {
    const startState = { ...initialState, ingredients: [ingredient] };
    const nextState = constructorReducer(startState, removeIngredients(0));
    expect(nextState.ingredients).toHaveLength(0);
  });

  it("should handle updateBun", () => {
    const nextState = constructorReducer(initialState, updateBun(bun));
    expect(nextState.bun).toEqual(bun);
  });

  it("should handle moveIngredient", () => {
    const startState = {
      ...initialState,
      ingredients: [
        { id: "643d69a5c3f7b9001cfa093c" },
        { id: "643d69a5c3f7b9001cfa0942" },
      ],
    };
    const nextState = constructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(nextState.ingredients[0].id).toBe("643d69a5c3f7b9001cfa0942");
    expect(nextState.ingredients[1].id).toBe("643d69a5c3f7b9001cfa093c");
  });

  it("should handle clearCart", () => {
    const startState = {
      bun: { id: "643d69a5c3f7b9001cfa093c" },
      ingredients: [{ id: "643d69a5c3f7b9001cfa0942" }],
    };
    const nextState = constructorReducer(startState, clearCart());
    expect(nextState).toEqual(initialState);
  });
});
