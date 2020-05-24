import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/orderContext';

const GET_USER_CLIENT = gql`
  query {
    getSellerClients {
      id
      name
      surname
      email
      company
      phone
    }
  }
`;

const AssignClient = () => {
  const [client, setClients] = useState([]);

  const orderContext = useContext(OrderContext);
  const { addClient } = orderContext;

  const { data, loading, error } = useQuery(GET_USER_CLIENT);

  useEffect(() => {
    addClient(client);
  }, [client]);

  const handleInputChange = (client) => {
    setClients(client);
  };

  if (loading) return null;

  const { getSellerClients } = data;

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        1. Asigna un cliente al pedido
      </p>
      <Select
        className='mt-3'
        options={getSellerClients}
        onChange={(value) => handleInputChange(value)}
        getOptionLabel={(options) => options.name}
        getOptionValue={(options) => options.id}
        placeholder='Busque o seleccione clientes'
        noOptionsMessage={() => 'No se encontrarn resultados'}
      />
    </>
  );
};

export default AssignClient;
