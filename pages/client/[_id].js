import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
      name
      surname
      email
      company
      phone
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
      name
      surname
      email
      company
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

const EditClient = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id,
    },
  });

  const [updateClient] = useMutation(UPDATE_CLIENT, {
    update(cache, { data: { updateClient } }) {
      const { getSellerClients } = cache.readQuery({ query: GET_USER_CLIENT });
      cache.writeQuery({
        query: GET_USER_CLIENT,
        data: {
          getSellerClients: [getSellerClients, updateClient],
        },
      });
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre del cliente es obligatorio'),
    surname: Yup.string().required('El apellido del cliente es obligatorio'),
    company: Yup.string().required('La empresa es obligatorio'),
    email: Yup.string()
      .email('Email no valido')
      .required('El email es obligatorio'),
  });

  const handleSubmit = async (values) => {
    const { name, surname, company, email, phone } = values;
    try {
      const { data } = await updateClient({
        variables: {
          id,
          input: {
            name,
            surname,
            company,
            email,
            phone,
          },
        },
      });
      Swal.fire('Actualizando...', data.deleteClient, 'success');
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return 'Cargando...';
  const { getClient } = data;

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
      <div className='flex justify-center mt-8'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={validationSchema}
            initialValues={getClient}
            enableReinitialize
            onSubmit={(values) => handleSubmit(values)}
          >
            {(props) => {
              return (
                <form
                  className='bg-white shadow-md px-8 pt-6 pb-6 mb-4'
                  onSubmit={props.handleSubmit}
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
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.name && props.errors.name && (
                      <p className='text-red-600'>{props.errors.name}</p>
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
                      value={props.values.surname}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.surname && props.errors.surname && (
                      <p className='text-red-600'>{props.errors.surname}</p>
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
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.company && props.errors.company && (
                      <p className='text-red-600'>{props.errors.company}</p>
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
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.email && props.errors.email && (
                      <p className='text-red-600'>{props.errors.email}</p>
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
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  <input
                    type='submit'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                    value='Editar cliente'
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditClient;
