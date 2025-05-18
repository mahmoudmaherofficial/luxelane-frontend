'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/lib/axiosInterceptor';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      console.log('Cart fetch response:', response.data); // Debug log
      // Filter out invalid items
      const validCart = {
        ...response.data,
        items: response.data.items.filter(
          (item) => item.product && item.product._id && item.product.price >= 0
        ),
      };
      setCart(validCart);
      setLoading(false);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to load cart';
      console.error('Fetch cart error:', err.response || err); // Debug log
      setError(message);
      if (message.includes('token')) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonText: 'Go to Login',
          customClass: {
            popup: 'bg-primary-50 text-primary-900',
            confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
          },
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          customClass: {
            popup: 'bg-primary-50 text-primary-900',
            confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
          },
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (
      !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))
    ) {
      errors.phoneNumber = 'Invalid phone number (10-15 digits required)';
    }
    if (
      formData.secondaryPhoneNumber &&
      !/^\+?\d{10,15}$/.test(formData.secondaryPhoneNumber.replace(/\s/g, ''))
    ) {
      errors.secondaryPhoneNumber =
        'Invalid secondary phone number (10-15 digits)';
    }
    return errors;
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart || !cart.items)
      return { subtotal: 0, totalDiscount: 0, totalAmount: 0 };
    let subtotal = 0;
    let totalDiscount = 0;
    let totalAmount = 0;
    cart.items.forEach((item) => {
      if (!item.product) return;
      const price = item.product.price || 0;
      const discount = item.product.discount || 0;
      const discountedPrice = price - discount;
      subtotal += price * item.quantity;
      totalDiscount += discount * item.quantity;
      totalAmount += discountedPrice * item.quantity;
    });
    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Your cart is empty',
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
      return;
    }

    // Validate cart items
    const invalidItems = cart.items.filter(
      (item) => !item.product || !item.product._id || item.product.price < 0
    );
    if (invalidItems.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Some cart items are invalid. Please remove them and try again.',
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fix the form errors',
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
      return;
    }

    setSubmitting(true);
    try {
      // Prepare products for order
      const products = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: parseFloat(
          (item.product.price - (item.product.discount || 0)).toFixed(2)
        ),
      }));

      const { totalAmount } = calculateTotals();

      console.log('Order payload:', {
        userId: cart.user,
        products,
        totalAmount: parseFloat(totalAmount),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        secondaryPhoneNumber: formData.secondaryPhoneNumber,
      }); // Debug log

      // Create order
      const response = await api.post('/orders', {
        userId: cart.user,
        products,
        totalAmount: parseFloat(totalAmount),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        secondaryPhoneNumber: formData.secondaryPhoneNumber,
      });

      // Clear cart
      await api.delete('/cart/clear');

      Swal.fire({
        icon: 'success',
        title: 'Order Placed',
        text: 'Your order has been created successfully!',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
        },
      }).then(() => {
        router.push('/orders');
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create order';
      console.error('Create order error:', err.response || err); // Debug log
      setError(message);
      if (message.includes('token')) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonText: 'Go to Login',
          customClass: {
            popup: 'bg-primary-50 text-primary-900',
            confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
          },
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          customClass: {
            popup: 'bg-primary-50 text-primary-900',
            confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
          },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-primary-900">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-10 text-primary-900">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Cart is Empty
        </h2>
        <Link href="/products">
          <Button className="px-6 py-2 text-base sm:text-lg">Shop Now</Button>
        </Link>
      </div>
    );
  }

  const { subtotal, totalDiscount, totalAmount } = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-6">
        Checkout
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Cart Summary */}
        <div className="md:w-1/2 bg-primary-50 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary-900 mb-4">
            Order Summary
          </h2>
          {cart.items.map((item, index) => (
            <div
              key={`${item.product?._id || index}-${item.size}-${item.color}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-primary-200 py-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.images?.[0] || '/product-placeholder.jpg'}
                  alt={item.product?.name || 'Unknown Product'}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-primary-900">
                    {item.product?.name || 'Unknown Product'}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-700">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-700">
                    {item.product ? (
                      <>
                        {item.product.discount > 0 ? (
                          <>
                            <span className="line-through text-secondary-500">
                              {item.product.price.toFixed(2)} EGP
                            </span>
                            <span className="ml-2">
                              {(
                                item.product.price - item.product.discount
                              ).toFixed(2)}{' '}
                              EGP
                            </span>
                          </>
                        ) : (
                          <span>{item.product.price.toFixed(2)} EGP</span>
                        )}
                        <span> x {item.quantity} = </span>
                        <span>
                          {(
                            (item.product.price -
                              (item.product.discount || 0)) *
                            item.quantity
                          ).toFixed(2)}{' '}
                          EGP
                        </span>
                      </>
                    ) : (
                      'Price unavailable'
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg text-primary-900">
                Subtotal:
              </span>
              <span className="text-base sm:text-lg text-primary-900">
                {subtotal} EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg text-primary-900">
                Total Discount:
              </span>
              <span className="text-base sm:text-lg text-primary-900">
                -{totalDiscount} EGP
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-primary-200 pt-2">
              <span className="text-base sm:text-lg font-semibold text-primary-900">
                Total:
              </span>
              <span className="text-base sm:text-lg font-semibold text-primary-900">
                {totalAmount} EGP
              </span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="md:w-1/2 bg-primary-50 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary-900 mb-4">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm sm:text-base text-primary-900 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm sm:text-base bg-primary-100 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                rows="4"
                placeholder="Enter your shipping address"
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm sm:text-base text-primary-900 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm sm:text-base bg-primary-100 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="+1234567890"
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="secondaryPhoneNumber"
                className="block text-sm sm:text-base text-primary-900 mb-1"
              >
                Secondary Phone Number (Optional)
              </label>
              <input
                id="secondaryPhoneNumber"
                name="secondaryPhoneNumber"
                type="tel"
                value={formData.secondaryPhoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm sm:text-base bg-primary-100 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="+1234567890"
              />
              {formErrors.secondaryPhoneNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formErrors.secondaryPhoneNumber}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-6 py-2 text-base sm:text-lg w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting
                  ? 'Placing Order...'
                  : `Place Order (${totalAmount} EGP)`}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
