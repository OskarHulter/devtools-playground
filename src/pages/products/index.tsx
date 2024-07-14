import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@sln/ui/components/navigation/Navbar';
import Footer from '@sln/ui/components/Footer';

const ProductsList = dynamic(() => import('shop_app/Products'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function index() {
  return (
    <main className='flex flex-col bg-white'>
      <Navbar />
      <ProductsList />
      <Footer />
    </main>
  );
}
