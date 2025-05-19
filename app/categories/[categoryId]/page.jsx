'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';

const CategoryDetailsPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!categoryId) return;

      try {
        setIsLoading(true);

        // Fetch category details
        const categoryResponse = await api.get(`/categories/${categoryId}`);
        console.log('Fetched category:', categoryResponse.data);
        setCategory(categoryResponse.data);

        // Fetch products for the category
        const productsResponse = await api.get(
          `/products?category=${categoryId}`
        );
        console.log('Fetched products:', productsResponse.data);
        setProducts(
          productsResponse.data.data.filter(
            (item) => item.category._id === categoryId
          )
        );

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        const message =
          err.response?.data?.message || 'Failed to fetch category or products';
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

    fetchCategoryAndProducts();
  }, [categoryId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <div className="text-center py-10 text-primary-900">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Category Not Found
          </h2>
          <Link href="/categories">
            <Button className="px-6 py-2 text-base sm:text-lg">
              Back to Categories
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
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </motion.div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-primary-900">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            No Products Found in this Category
          </h2>
          <Link href="/products">
            <Button className="px-6 py-2 text-base sm:text-lg">
              Browse All Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      )}
    </section>
  );
};

export default CategoryDetailsPage;
