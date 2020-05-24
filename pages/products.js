import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Product from '../components/Product';

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

const products = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const router = useRouter();
  if (loading) return 'Cargando...';
  if (!data) return router.push('/signin');
  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>
        <Link href='/newproduct'>
          <a className='w-full lg:w-auto text-center bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>
            Nuevo producto
          </a>
        </Link>
        {error ? (
          <p className='text-red-800 text-center mt-6'>{error.message}</p>
        ) : (
          <div className='overflow-x-scroll'>
            <table className='table-auto shadow-md mt-10 w-full w-lg'>
              <thead className='bg-gray-800 text-white'>
                <tr>
                  <th className='w-1/5 py-2'>Nombre</th>
                  <th className='w-1/5 py-2'>Cantidad</th>
                  <th className='w-1/5 py-2'>Precio</th>
                  <th className='w-1/5 py-2'>Eliminar</th>
                  <th className='w-1/5 py-2'>Editar</th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {data.getProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default products;
