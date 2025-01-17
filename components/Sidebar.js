import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className='bg-gray-800 md:w-1/5 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
      <div>
        <p className='text-white text-2xl font-black'>CRM Client</p>
      </div>
      <nav className='mt-5 list-none'>
        <li className={router.pathname === '/' ? 'bg-blue-800 p-2' : 'p-2'}>
          <Link href='/'>
            <a className='text-white'>Clients</a>
          </Link>
        </li>
        <li
          className={router.pathname === '/orders' ? 'bg-blue-800 p-2' : 'p-2'}
        >
          <Link href='/orders'>
            <a className='text-white'>Pedidos</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === '/products' ? 'bg-blue-800 p-2' : 'p-2'
          }
        >
          <Link href='/products'>
            <a className='text-white'>Productos</a>
          </Link>
        </li>
      </nav>
      <div className='sm:mt-10'>
        <p className='text-white text-2xl font-black'>Otras opciones</p>
      </div>
      <nav className='mt-5 list-none'>
        <li
          className={
            router.pathname === '/bestsellers' ? 'bg-blue-800 p-2' : 'p-2'
          }
        >
          <Link href='/bestsellers'>
            <a className='text-white'>Mejores vendedores</a>
          </Link>
        </li>{' '}
        <li
          className={
            router.pathname === '/bestclients' ? 'bg-blue-800 p-2' : 'p-2'
          }
        >
          <Link href='/bestclients'>
            <a className='text-white'>Mejores clientes</a>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
