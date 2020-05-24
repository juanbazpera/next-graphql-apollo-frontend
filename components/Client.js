import React from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
import Router from 'next/router';

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;
const GET_USER_CLIENT = gql`
  query {
    getSellerClients {
      id
      name
      surname
      email
      company
      phone
      created
    }
  }
`;

const Client = ({ client }) => {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getSellerClients } = cache.readQuery({ query: GET_USER_CLIENT });
      cache.writeQuery({
        query: GET_USER_CLIENT,
        data: {
          getSellerClients: getSellerClients.filter(
            (actualClient) => actualClient.id !== client.id
          ),
        },
      });
    },
  });
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Confirmar',
      text: `Seguro que quiere eliminar a '${name}'`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteClient({
            variables: {
              id,
            },
          });
          Swal.fire('Eliminado!', data.deleteClient, 'success');
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const handleEdit = () => {
    Router.push({
      pathname: '/client/[_id]',
      query: { id: client.id },
    });
  };

  return (
    <tr key={client.id}>
      <td className='border px-4 py-2'>
        {client.name} {client.surname}
      </td>
      <td className='border px-4 py-2'>{client.company}</td>
      <td className='border px-4 py-2'>{client.email} </td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex justify-center items-center bg-red-800 pd-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
          onClick={() => handleDelete(client.id, client.name)}
        >
          <svg fill='currentColor' viewBox='0 0 20 20' className='w-4 h-4 mr-2'>
            <path
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
              fillRule='evenodd'
            ></path>
          </svg>
          Eliminar
        </button>
      </td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex justify-center items-center bg-green-900 pd-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
          onClick={handleEdit}
        >
          <svg fill='currentColor' viewBox='0 0 20 20' className='w-4 h-4 mr-2'>
            <path
              d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'
              clipRule='evenodd'
              fillRule='evenodd'
            ></path>
          </svg>
          Editar
        </button>
      </td>
    </tr>
  );
};

export default Client;
