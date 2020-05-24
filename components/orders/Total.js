import React, { useContext } from 'react';
import OrderContext from '../../context/orderContext';

const Total = () => {
  const orderContext = useContext(OrderContext);
  const { total } = orderContext;
  return (
    <div className='flex item-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-400'>
      <h2 className='text-gray-800 text-large'>Total a pagar</h2>
      <p className='text-gray-800 mt-0'>$ {total}</p>
    </div>
  );
};

export default Total;
