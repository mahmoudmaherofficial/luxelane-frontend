'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { FaEye } from 'react-icons/fa6';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/categories');
        console.log('Fetched categories:', response.data); // Debug log
        setCategories(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        const message =
          err.response?.data?.message || 'Failed to fetch categories';
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
    fetchCategories();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          Categories
        </h1>
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
            Categories
          </h1>
        </motion.div>
        <div className="text-center py-10 text-primary-900">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            No Categories Found
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
          Categories
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Category Details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-primary-900 truncate">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="mt-4">
                <Link href={`/categories/${category._id}`}>
                  <Button
                    variant="outline-primary"
                    className="flex items-center gap-2 w-full justify-center"
                  >
                    <FaEye className="w-4 h-4" /> View Details
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesPage;
