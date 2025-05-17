'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/lib/axiosInterceptor';
import Swal from 'sweetalert2';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      console.log('Cart fetch response:', response.data); // Debug log
      setCart(response.data);
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

  // Update item quantity
  const updateQuantity = async (productId, size, color, quantity) => {
    if (!productId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot update quantity: Product is invalid',
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
      setError('Cannot update quantity: Product is invalid');
      return;
    }
    setUpdating(true);
    try {
      await api.put('/cart/update', {
        productId,
        size,
        color,
        quantity,
      });
      await fetchCart();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Quantity updated successfully',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to update cart';
      console.error('Update quantity error:', err.response || err); // Debug log
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
      setUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId, size, color) => {
    if (!productId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot remove item: Product is invalid',
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
      setError('Cannot remove item: Product is invalid');
      return;
    }
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Remove Item',
      text: 'Are you sure you want to remove this item from your cart?',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-primary-50 text-primary-900',
        confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        cancelButton: 'bg-secondary-200 text-primary-900 px-4 py-2 rounded',
      },
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete('/cart/remove', {
        data: { productId, size, color },
      });
      await fetchCart();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Item removed from cart',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to remove item';
      console.error('Remove item error:', err.response || err); // Debug log
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
    }
  };

  // Clear cart
  const clearCart = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Clear Cart',
      text: 'Are you sure you want to clear your cart?',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-primary-50 text-primary-900',
        confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        cancelButton: 'bg-secondary-200 text-primary-900 px-4 py-2 rounded',
      },
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete('/cart/clear');
      await fetchCart();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Cart cleared successfully',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to clear cart';
      console.error('Clear cart error:', err.response || err); // Debug log
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
    }
  };

  // Calculate total
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .reduce((total, item) => {
        if (!item.product) return total; // Skip invalid items
        const price = item.product.price - (item.product.discount || 0);
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-6">
        Your Cart
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary-50 p-4 sm:p-6 rounded-lg shadow-lg"
      >
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
                  {item.product
                    ? `${(item.product.price - (item.product.discount || 0)).toFixed(1)} x ${item.quantity} = ${(
                        (item.product.price - (item.product.discount || 0)) *
                        item.quantity
                      ).toFixed(1)} EGP`
                    : 'Price unavailable'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-8 h-8 sm:w-8 sm:h-8 text-sm"
                  onClick={() =>
                    updateQuantity(
                      item.product?._id,
                      item.size,
                      item.color,
                      item.quantity - 1
                    )
                  }
                  disabled={updating || item.quantity <= 1 || !item.product}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.product?._id,
                      item.size,
                      item.color,
                      Math.min(
                        Math.max(parseInt(e.target.value, 10), 1),
                        item.product?.stock || 1
                      )
                    )
                  }
                  className="w-12 sm:w-14 px-2 py-1 text-center bg-primary-100 text-primary-900 rounded-full hide-number-arrows text-sm"
                  min={1}
                  max={item.product?.stock || 1}
                  disabled={updating || !item.product}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-8 h-8 sm:w-8 sm:h-8 text-sm"
                  onClick={() =>
                    updateQuantity(
                      item.product?._id,
                      item.size,
                      item.color,
                      item.quantity + 1
                    )
                  }
                  disabled={
                    updating ||
                    item.quantity >= (item.product?.stock || 1) ||
                    !item.product
                  }
                >
                  +
                </Button>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="px-3 py-1 sm:px-4 sm:py-2 text-sm"
                onClick={() =>
                  removeItem(item.product?._id, item.size, item.color)
                }
                disabled={updating || !item.product}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <Button
            variant="outline-danger"
            onClick={clearCart}
            className="px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
            disabled={updating}
          >
            Clear Cart
          </Button>
          <div className="text-base sm:text-lg font-semibold text-primary-900">
            Total: {calculateTotal()} EGP
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Link href="/checkout">
            <Button
              className="px-6 py-2 text-base sm:text-lg w-full sm:w-auto"
              disabled={updating}
            >
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;
