import {
  PRODUCTS_CANT,
  SELECT_PRODUCT,
  SELECT_CLIENT,
  UPDATE_TOTAL,
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SELECT_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case SELECT_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };
    case PRODUCTS_CANT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? (product = action.payload)
            : product
        ),
      };
    case UPDATE_TOTAL:
      return {
        ...state,
        total: state.products
          .map((product) => product.price * product.quantity)
          .reduce((newTotal, cant) => newTotal + cant),
      };
    default:
      return state;
  }
};
