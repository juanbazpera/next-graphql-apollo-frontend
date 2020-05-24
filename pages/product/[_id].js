import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      exists
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id, input: $input) {
      name
      exists
      price
    }
  }
`;

const EditProduct = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      id,
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    update(cache, { data: { updateProduct } }) {
      const { getProduct } = cache.readQuery({ query: GET_PRODUCT });
      cache.writeQuery({
        query: GET_PRODUCT,
        data: {
          getProduct: [getProduct, updateProduct],
        },
      });
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    exists: Yup.number()
      .required('La cantidad es requerida')
      .positive('La cantidad debe ser mayor a 0'),
    price: Yup.number()
      .required('El precio es requerido')
      .positive('El precio debe ser mayor a 0'),
  });

  const handleSubmit = async (values) => {
    const { name, exists, price } = values;
    try {
      const { data } = await updateProduct({
        variables: {
          id,
          input: {
            name,
            exists,
            price,
          },
        },
      });
      Swal.fire('Actualizando...', data.updateProduct, 'success');
      router.push('/products');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return 'Cargando...';
  const { getProduct } = data;

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
      <div className='flex justify-center mt-8'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={validationSchema}
            initialValues={getProduct}
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
                      Cantidad
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='surname'
                      type='text'
                      value={props.values.exists}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.exists && props.errors.exists && (
                      <p className='text-red-600'>{props.errors.exists}</p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='company'
                    >
                      Precio
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='company'
                      type='number'
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.price && props.errors.price && (
                      <p className='text-red-600'>{props.errors.price}</p>
                    )}
                  </div>
                  <input
                    type='submit'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                    value='Editar producto'
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

export default EditProduct;
