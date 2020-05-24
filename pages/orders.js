import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Order from '../components/Order';

const GET_SELLER_ORDERS = gql`
  query {
    getSellerOrders {
      orders {
        id
        quantity
      }
      seller
      id
      total
      state
      client {
        id
        name
        surname
        email
        phone
      }
    }
  }
`;

const orders = () => {
  const { data, loading, error } = useQuery(GET_SELLER_ORDERS);

  if (loading) return null;

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Ordenes</h1>
        <Link href='/neworder'>
          <a className='w-full lg:w-auto text-center bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>
            Nueva Orden
          </a>
        </Link>
        {error ? (
          <p className='text-red-800 text-center mt-6'>{error.message}</p>
        ) : (
          data.getSellerOrders.map((order) => (
            <Order key={order.id} order={order} />
          ))
        )}
      </Layout>
    </div>
  );
};

export default orders;
