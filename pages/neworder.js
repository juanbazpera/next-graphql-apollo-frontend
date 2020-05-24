import React, { useContext, useState } from 'react';
import OrderContext from '../context/orderContext';
import Layout from '../components/Layout';
import AssignClient from '../components/orders/AssignClient';
import AssignOrder from '../components/orders/AssignOrder';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

const GET_SELLER_ORDERS = gql`
  query getSellerOrders {
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

const neworder = () => {
  const orderContext = useContext(OrderContext);
  const [message, setMessage] = useState(null);
  const { client, products, total } = orderContext;
  const router = useRouter();

  const [newOrder] = useMutation(NEW_ORDER, {
    update(cache, { data: { newOrder } }) {
      const { getSellerOrders } = cache.readQuery({ query: GET_SELLER_ORDERS });
      cache.writeQuery({
        query: GET_SELLER_ORDERS,
        data: {
          getSellerOrders: [getSellerOrders, newOrder],
        },
      });
    },
  });
  const { id } = client;

  const handleNewOrder = async () => {
    const orders = products.map(
      ({ exists, __typename, created, ...product }) => product
    );

    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: id,
            total,
            orders,
          },
        },
      });
      Swal.fire('Correcto', 'El pedido se registro correctamente', 'success');
      router.push('/orders');
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  const validateOrder = () => {
    return (
      (!products.every((product) => product.quantity > 0) ||
        total === 0 ||
        client.length === 0) &&
      'opacity-50 cursor-not-allowed'
    );
  };
  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Crear nuevo pedido</h1>
      {message && <p className='text-red-800 text-center mt-6'>{message}</p>}
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <AssignClient />
          <AssignOrder />
          <OrderSummary />
          <Total />
          <button
            type='button'
            className={`bg-gray-800  w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
            onClick={handleNewOrder}
          >
            Registrar pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default neworder;
