import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const USER_AUTH = gql`
  mutation authUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

const SignIn = () => {
  const router = useRouter();
  const [authUser] = useMutation(USER_AUTH);
  const [message, setMessage] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email no valido')
        .required('El email es requerido'),
      password: Yup.string()
        .min(6, 'El password debe tener al menos 6 caracteres')
        .required('El password es requerido'),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      try {
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        setMessage('Autenticado...');

        setTimeout(() => {
          const { token } = data.authUser;
          localStorage.setItem('token', token);
        }, 1000);
        setTimeout(() => {
          setMessage(null);
          router.push('/');
        }, 1000);
      } catch (err) {
        setMessage(err.message);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    },
  });
  return (
    <Layout>
      {message && (
        <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
          <p>{message}</p>
        </div>
      )}
      <h1 className='text-center text-2xl text-white'>Login</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}
          >
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
                htmlFor='password'
              >
                Password
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                type='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className='text-red-600'>{formik.errors.password}</p>
              )}
            </div>
            <input
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white uppercase  hover:bg-gray-900'
              value='Iniciar sesión'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
