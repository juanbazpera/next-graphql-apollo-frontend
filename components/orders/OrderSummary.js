import React, { useContext } from 'react';
import OrderContext from '../../context/orderContext';
import ProductSummary from './ProductSummary';

const OrderSummary = () => {
  const orderContext = useContext(OrderContext);
  const { products } = orderContext;
  console.log(products);
  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        3. Cantidades
      </p>
      {products.length > 0 ? (
        products.map((product) => (
          <ProductSummary key={product.id} product={product} />
        ))
      ) : (
        <p className='mt-5 text-sm'>No hay productos seleccionados</p>
      )}
    </>
  );
};

export default OrderSummary;
