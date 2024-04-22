import PropTypes from "prop-types";

export const ingredientType = PropTypes.arrayOf(
    PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
        images: PropTypes.string,
        image_large: PropTypes.string,
        calories: PropTypes.number,
        proteins: PropTypes.number,
        fat: PropTypes.number,
        carbohydrates: PropTypes.number,
      })
);

