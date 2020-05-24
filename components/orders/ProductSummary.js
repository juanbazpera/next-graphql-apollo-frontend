import React, { useContext, useState, useEffect } from 'react';
import OrderContext from '../../context/orderContext';

const ProductSummary = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const orderContext = useContext(OrderContext);
  const { setProductCant, updateTotal } = orderContext;

  const updateQuantity = () => {
    const newProduct = { ...product, quantity: Number(quantity) };
    setProductCant(newProduct);
  };

  useEffect(() => {
    if (quantity > 0) {
      updateQuantity();
      updateTotal();
    }
  }, [quantity]);

  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
      <div className='md:w-2/4 mb-2 md:mb-0'>
        <p className='text-sm'>{product.name}</p>
        <p>$ {product.price}</p>
      </div>
      <input
        type='number'
        placeholder='Cantidad'
        className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focut:outline-none focus:shadow-outline md:ml-4'
        onChange={(e) => setQuantity(e.target.value)}
      />
    </div>
  );
};

export default ProductSummary;
