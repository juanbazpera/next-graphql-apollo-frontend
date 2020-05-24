import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      state
    }
  }
`;

const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

const GET_SELLER_ORDERS = gql`
  query getSellerOrders {
    getSellerOrders {
      id
    }
  }
`;

const Order = ({ order }) => {
  const {
    id,
    total,
    client: { name, surname, phone, email, id: clientId },
    state,
  } = order;
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      const { getSellerOrders } = cache.readQuery({ query: GET_SELLER_ORDERS });

      cache.writeQuery({
        query: GET_SELLER_ORDERS,
        data: {
          getSellerOrders: getSellerOrders.filter(
            (actualOrder) => actualOrder.id !== id
          ),
        },
      });
    },
  });
  const [statedSelected, setstatedSelected] = useState(state);
  const [clazz, setClazz] = useState('');

  useEffect(() => {
    if (statedSelected) {
      setstatedSelected(statedSelected);
    }
    orderClazz();
  }, [statedSelected]);

  const orderClazz = () => {
    switch (statedSelected) {
      case 'COMPLETED':
        setClazz('border-green-500');
        break;
      case 'PENDING':
        setClazz('border-yellow-500');
        break;

      default:
        setClazz('border-red-800');
        break;
    }
  };

  const handleChangeState = async (newState) => {
    try {
      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            state: newState,
            client: clientId,
          },
        },
      });
      setstatedSelected(data.updateOrder.state);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrder = async () => {
    Swal.fire({
      title: 'Confirmar',
      text: `Seguro que quiere eliminar el pedido?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteOrder({
            variables: {
              id,
            },
          });
          Swal.fire('Eliminado!', data.deleteOrder, 'success');
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  return (
    <div
      className={`mt-4 bg-white rounded p-6 md:grid  md:grid-cols-2 md:gap-4 shadow-lg ${clazz} border-t-4`}
    >
      <div>
        <p className='font-bold text-gray-800'>
          Cliente: {name} {surname}
        </p>
        {email && (
          <p className='flex items-center my-2 '>
            <svg
              fill='currentColor'
              viewBox='0 0 20 20'
              className='w-4 h-4 mr-2'
            >
              <path
                d='M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z'
                clipRule='evenodd'
                fillRule='evenodd'
              ></path>
            </svg>
            {email}
          </p>
        )}
        {phone && (
          <p className='flex items-center my-2 '>
            <svg
              fill='currentColor'
              viewBox='0 0 20 20'
              className='w-4 h-4 mr-2'
            >
              <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'></path>
            </svg>
            {phone}
          </p>
        )}
        <h2 className='text-gray-800 font-bold mt-10'>
          Estado pedido: {state}
        </h2>
        <select
          className='mt-2 apperance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
          value={statedSelected}
          onChange={(e) => handleChangeState(e.target.value)}
        >
          <option value='COMPLETED'>COMPLETADO</option>
          <option value='PENDING'>PENDIENTE</option>
          <option value='CANCELED'>CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className='text-gray-800 font-bold mt-2'>Resumen pedido</h2>
        {order.orders.map((art) => (
          <div key={art.id} className='mt-4'>
            <p className='text-sm text-gray-600'>Producto: {art.name}</p>
            <p className='text-sm text-gray-600'>Cantidad: {art.quantity}</p>
          </div>
        ))}
        <p className='text-gray-800 mt-3 font-bold'>
          Total a pagar: <span className='font-light'>$ {total}</span>
        </p>

        <button
          className='flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold'
          onClick={handleDeleteOrder}
        >
          <svg fill='currentColor' viewBox='0 0 20 20' className='w-4 h-4 mr-2'>
            <path
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
              fillRule='evenodd'
            ></path>
          </svg>
          Eliminar pedido
        </button>
      </div>
    </div>
  );
};

export default Order;
