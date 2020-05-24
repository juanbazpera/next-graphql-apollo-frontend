import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';

const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      id
      name
      price
      exists
      created
    }
  }
`;

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

const newProduct = () => {
  const router = useRouter();
  const [newProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct } }) {
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [...getProducts, newProduct],
        },
      });
    },
  });
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      exists: '',
      price: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es requerido'),
      exists: Yup.number()
        .required('La cantidad es requerida')
        .positive('La cantidad debe ser mayor a 0'),
      price: Yup.number()
        .required('El precio es requerido')
        .positive('El precio debe ser mayor a 0'),
    }),
    onSubmit: async (values) => {
      const { name, exists, price } = values;
      try {
        await newProduct({
          variables: {
            input: {
              name,
              exists,
              price,
            },
          },
        });
        router.push('/products');
      } catch (error) {
        setError(err.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    },
  });
  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
      {error && <p className='text-red-800 text-center mt-6'>{error}</p>}
      <div className='flex justify-center mt-8'>
        <div className='w-full max-w-lg'>
          <form
            className='bg-white shadow-md px-8 pt-6 pb-6 mb-4'
            onSubmit={formik.handleSubmit}
          >
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='name'
              >
                Nombre
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='name'
                type='text'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className='text-red-600'>{formik.errors.name}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='exists'
              >
                Cantidad
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='exists'
                type='number'
                value={formik.values.exists}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.exists && formik.errors.exists && (
                <p className='text-red-600'>{formik.errors.exists}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='price'
              >
                Precio
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='price'
                type='number'
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <p className='text-red-600'>{formik.errors.price}</p>
              )}
            </div>
            <input
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
              value='Nuevo producto'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default newProduct;
