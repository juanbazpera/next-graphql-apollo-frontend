import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const GET_BEST_SELLERS = gql`
  query {
    getBestSellers {
      user {
        name
      }
      total
    }
  }
`;

const bestsellers = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_BEST_SELLERS
  );

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const sellersChart = [];

  if (loading) return null;

  const { getBestSellers } = data;

  getBestSellers.map((seller, index) => {
    sellersChart[index] = { ...seller.user[0], total: seller.total };
  });

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Mejores vendedores</h1>
      <ResponsiveContainer width='99%' height={550}>
        <BarChart
          className='mt-10'
          width={600}
          height={500}
          data={sellersChart}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='total' fill='#3182ce' />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default bestsellers;
