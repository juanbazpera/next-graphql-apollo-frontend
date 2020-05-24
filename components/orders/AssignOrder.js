import React, { useContext, useState, useEffect } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/orderContext';

const GET_PRODUCTS = gql`
  query {
    getProducts {
      id
      name
      exists
      price
      created
    }
  }
`;

const AssignOrder = () => {
  const [products, setProducts] = useState([]);
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const orderContext = useContext(OrderContext);
  const { addProducts } = orderContext;

  useEffect(() => {
    if (products) {
      addProducts(products);
    }
  }, [products]);

  if (loading) return null;

  const { getProducts } = data;

  const handleInputChange = (products) => {
    setProducts(products);
  };

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        2. Selecciona productos
      </p>
      <Select
        className='mt-3'
        isMulti
        options={getProducts}
        onChange={(value) => handleInputChange(value)}
        getOptionLabel={(options) =>
          `${options.name} - ${options.exists} disponibles`
        }
        getOptionValue={(options) => options.id}
        placeholder='Busque o seleccione clientes'
        noOptionsMessage={() => 'No se encontrarn resultados'}
      />
    </>
  );
};

export default AssignOrder;
