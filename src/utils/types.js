import PropTypes from "prop-types";

export const ingredientDetailsType = PropTypes.shape({
  image_large: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  calories: PropTypes.number.isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
});

export const orderDetailsType = PropTypes.shape({
  order: PropTypes.number,
});

export const boxType = PropTypes.shape({
  item: PropTypes.object,
  onClick: PropTypes.func,
});

export const sortableIngredientType = PropTypes.shape({
  ingredient: PropTypes.object,
  index: PropTypes.node,
  moveIngredient: PropTypes.func,
  handleRemove: PropTypes.func,
  onDropEnd: PropTypes.func,
  ingredientId: PropTypes.string,
});

export const dustbinType = PropTypes.shape({
  accept: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.object,
});

export const protectedRouteElement = PropTypes.shape({
  restrictMode: PropTypes.bool,
  redirectPath: PropTypes.string,
  restrictedPaths: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
});
