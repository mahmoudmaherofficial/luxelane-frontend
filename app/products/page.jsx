'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { FaEye } from 'react-icons/fa6';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';

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

  const calculatePrice = (product) => {
    const originalPrice = product.price || 0;
    const discount = product.discount || 0;
    const discountedPrice = originalPrice - discount;
    return {
      originalPrice: originalPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      hasDiscount: discount > 0,
    };
  };

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
        {products.map((product, index) => {
          const { originalPrice, discountedPrice, hasDiscount } =
            calculatePrice(product);
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative w-full h-96 lg:h-80">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-primary-900 truncate">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-base font-semibold text-primary-900">
                    {discountedPrice} L.E
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {originalPrice} L.E
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-xs text-green-600">
                    Save {product.discount.toFixed(2)} L.E
                  </span>
                )}
                <div className="mt-4">
                  <Link href={`/products/${product._id}`}>
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
          );
        })}
      </div>
    </section>
  );
};

export default ProductsPage;
