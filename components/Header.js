import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
  query {
    getUser {
      id
      name
      surname
      email
    }
  }
`;

const Header = () => {
  const { data, loading, error } = useQuery(GET_USER);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (loading) return 'Cargando...';
  if (!data) router.push('/signin');
  return (
    <div className='sm:flex sm:justify-between'>
      <h1 className='mr-2 mb-5 lg:mb-0'>Hola {data.getUser.name}</h1>
      <button
        className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
        type='button'
        onClick={logout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
