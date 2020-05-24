import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';

const NEW_CLIENT = gql`
  mutation newClient($input: ClientInput) {
    newClient(input: $input) {
      id
      name
      surname
      company
      email
      phone
    }
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

const newClient = () => {
  const router = useRouter();
  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient } }) {
      const { getSellerClients } = cache.readQuery({ query: GET_USER_CLIENT });
      // Reescribir el cache porque es inmutable
      cache.writeQuery({
        query: GET_USER_CLIENT,
        data: {
          getSellerClients: [...getSellerClients, newClient],
        },
      });
    },
  });
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      company: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre del cliente es obligatorio'),
      surname: Yup.string().required('El apellido del cliente es obligatorio'),
      company: Yup.string().required('La empresa es obligatorio'),
      email: Yup.string()
        .email('Email no valido')
        .required('El email es obligatorio'),
    }),
    onSubmit: async (values) => {
      const { name, surname, company, email, phone } = values;
      try {
        await newClient({
          variables: {
            input: {
              name,
              surname,
              company,
              email,
              phone,
            },
          },
        });
        router.push('/');
      } catch (err) {
        setError(err.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    },
  });

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
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
                htmlFor='surname'
              >
                Apellido
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='surname'
                type='text'
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.surname && formik.errors.surname && (
                <p className='text-red-600'>{formik.errors.surname}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='company'
              >
                Empresa
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='company'
                type='text'
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.company && formik.errors.company && (
                <p className='text-red-600'>{formik.errors.company}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='email'
              >
                Email
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className='text-red-600'>{formik.errors.email}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='phone'
              >
                Telefono
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='phone'
                type='tel'
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <input
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
              value='Registrar cliente'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default newClient;
