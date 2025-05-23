'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';
import ProductCard from '@/components/ui/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        console.log('Fetched products:', response.data); // Debug log
        setProducts(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        const message =
          err.response?.data?.message || 'Failed to fetch products';
        setError(message);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonColor: '#1a3d60',
        });
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          Products
        </h1>
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
            Products
          </h1>
        </motion.div>
        <div className="text-center py-10 text-primary-900">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            No Products Found
          </h2>
          <Link href="/">
            <Button className="px-6 py-2 text-base sm:text-lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
          Products
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductsPage;
