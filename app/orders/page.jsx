'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';
import { formatDate } from '@/lib/formatDate';
import OrderStatusBadge from '@/constants/OrderStatusBadge';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/orders/user');
        console.log('Fetched user orders:', response.data); // Debug log
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user orders:', err);
        const message =
          err.response?.data?.message || 'Failed to fetch your orders';
        setError(message);
        setIsLoading(false);
        if (message.includes('token')) {
          Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please log in again.',
            confirmButtonText: 'Go to Login',
            confirmButtonColor: '#1a3d60',
          }).then(() => {
            window.location.href = '/login';
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#1a3d60',
          });
        }
      }
    };
    fetchUserOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const calculateOrderSummary = (order) => {
    let subtotal = 0;
    let totalDiscount = 0;
    order.products.forEach((item) => {
      const originalPrice = item.price + (item.discount || 0);
      subtotal += originalPrice * item.quantity;
      totalDiscount += (item.discount || 0) * item.quantity;
    });
    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalAmount: order.totalAmount.toFixed(2),
    };
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          My Orders
        </h1>
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
            My Orders
          </h1>
        </motion.div>
        <div className="text-center py-10 text-primary-900">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            No Orders Found
          </h2>
          <Link href="/products">
            <Button className="px-6 py-2 text-base sm:text-lg">Shop Now</Button>
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
          My Orders
        </h1>
      </motion.div>

      <div className="space-y-6">
        {orders.map((order, index) => {
          const { subtotal, totalDiscount, totalAmount } =
            calculateOrderSummary(order);
          const isExpanded = expandedOrder === order._id;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 cursor-pointer bg-primary-50"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                  <h2 className="text-lg font-semibold text-primary-900">
                    Order *****${order._id.slice(-6)}
                  </h2>
                  <span className={OrderStatusBadge(order)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="text-sm text-primary-900">
                    {formatDate(order.orderDate, true)}
                  </span>
                  <span className="text-sm font-semibold text-primary-900">
                    {totalAmount} L.E
                  </span>
                  <button className="text-primary-600">
                    {isExpanded ? (
                      <FaChevronUp className="w-5 h-5" />
                    ) : (
                      <FaChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="p-6 bg-white overflow-hidden"
                  >
                    {/* Products Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              #
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Product Name
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Quantity
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Original Price
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Unit Discount
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Total Discount
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Unit Price (After Discount)
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((item, idx) => (
                            <tr
                              key={idx}
                              className={`hover:bg-gray-100 ${idx % 2 !== 0 ? 'bg-gray-50' : ''}`}
                            >
                              <td className="py-2 px-4 border-b text-sm">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {item.product.name}
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {item.quantity}
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {(item.price + (item.discount || 0)).toFixed(2)}{' '}
                                L.E
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {(item.discount || 0).toFixed(2)} L.E
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {((item.discount || 0) * item.quantity).toFixed(
                                  2
                                )}{' '}
                                L.E
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {item.price.toFixed(2)} L.E
                              </td>
                              <td className="py-2 px-4 border-b text-sm">
                                {(item.price * item.quantity).toFixed(2)} L.E
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-primary-900 mb-4">
                        Order Summary
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-medium text-primary-900">
                          Subtotal:
                        </span>
                        <span className="text-base text-primary-900">
                          {subtotal} L.E
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-medium text-primary-900">
                          Total Discount:
                        </span>
                        <span className="text-base text-primary-900">
                          -{totalDiscount} L.E
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span className="text-base font-semibold text-primary-900">
                          Total:
                        </span>
                        <span className="text-base font-semibold text-primary-900">
                          {totalAmount} L.E
                        </span>
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-primary-900 mb-4">
                        Order Information
                      </h3>
                      <p className="text-sm text-primary-900">
                        <strong>Phone Number:</strong> {order.phoneNumber}
                      </p>
                      {order.address && (
                        <p className="text-sm text-primary-900">
                          <strong>Address:</strong> {order.address}
                        </p>
                      )}
                      {order.secondaryPhoneNumber && (
                        <p className="text-sm text-primary-900">
                          <strong>Secondary Phone:</strong>{' '}
                          {order.secondaryPhoneNumber}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default UserOrdersPage;
