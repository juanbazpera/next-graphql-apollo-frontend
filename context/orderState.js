import React, { useReducer } from 'react';
import OrderContext from './orderContext';
import {
  PRODUCTS_CANT,
  SELECT_PRODUCT,
  SELECT_CLIENT,
  UPDATE_TOTAL,
} from '../types';
import OrderReducer from './orderReducer';

const OrderSatate = ({ children }) => {
  const initialState = {
    client: {},
    products: [],
    total: 0,
  };
  const [state, dispatch] = useReducer(OrderReducer, initialState);

  const addClient = (client) => {
    dispatch({
      type: SELECT_CLIENT,
      payload: client,
    });
  };

  const addProducts = (selectedProducts) => {
    let newState = [];
    if (state.products.length > 0) {
      newState = selectedProducts.map((product) => {
        const newObject = state.products.find(
          (productState) => productState.id === product.id
        );
        return {
          ...product,
          ...newObject,
        };
      });
    } else {
      newState = selectedProducts;
    }
    dispatch({
      type: SELECT_PRODUCT,
      payload: newState,
    });
  };

  const setProductCant = (product) => {
    dispatch({ type: PRODUCTS_CANT, payload: product });
  };

  const updateTotal = () => {
    dispatch({
      type: UPDATE_TOTAL,
    });
  };

  return (
    <OrderContext.Provider
      value={{
        client: state.client,
        products: state.products,
        total: state.total,
        addClient,
        addProducts,
        setProductCant,
        updateTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
export default OrderSatate;
