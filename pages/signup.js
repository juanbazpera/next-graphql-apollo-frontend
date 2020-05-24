import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_ACCOUNT = gql`
  mutation newUser($input: UserInput) {
    newUser(input: $input) {
      id
      name
      surname
      email
    }
  }
`;

const SignUp = () => {
  const [newUser] = useMutation(NEW_ACCOUNT);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es obligatorio'),
      surname: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string()
        .email('Email no valido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('El password es obligatorio')
        .min(6, 'El password debe tener al menos 6 caracteres'),
    }),
    onSubmit: async (values) => {
      const { name, surname, email, password } = values;
      try {
        const { data } = await newUser({
          variables: {
            input: {
              name,
              surname,
              email,
              password,
            },
          },
        });
        setMessage(`Se creo correctamente el usuario '${data.newUser.name}'`);
        setTimeout(() => {
          setMessage(null);
          router.push('/');
        }, 3000);

        console.log(data);
      } catch (error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
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
      <h1 className='text-center text-2xl text-white'>Crear nueva cuenta</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
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
              {formik.errors.name && formik.errors.name && (
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
              value='Crear cuenta'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
