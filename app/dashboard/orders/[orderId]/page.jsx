'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { FaArrowLeft, FaPen } from 'react-icons/fa6';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '@/lib/axiosInterceptor';
import { getOrderById } from '@/api/orders';
import { formatDate } from '@/lib/formatDate';
import { useParams } from 'next/navigation';
import OrderStatusBadge from '@/constants/OrderStatusBadge';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch order details',
          confirmButtonColor: '#1a3d60',
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const calculateTotals = () => {
    if (!order || !order.products)
      return { subtotal: 0, totalDiscount: 0, totalAmount: 0 };
    let subtotal = 0;
    let totalDiscount = 0;
    order.products.forEach((item) => {
      const originalPrice = item.price + (item.discount || 0); // Reconstruct original price
      subtotal += originalPrice * item.quantity;
      totalDiscount += (item.discount || 0) * item.quantity;
    });
    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalAmount: order.totalAmount.toFixed(2),
    };
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    const validStatuses = [
      'pending',
      'processing',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];
    const { value: newStatus } = await Swal.fire({
      title: 'Update Order Status',
      input: 'select',
      inputOptions: validStatuses.reduce((acc, status) => {
        acc[status] = status.charAt(0).toUpperCase() + status.slice(1);
        return acc;
      }, {}),
      inputValue: order.status,
      inputPlaceholder: 'Select status',
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#1a3d60',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a status!';
        }
        if (value === order.status) {
          return 'Please select a different status!';
        }
        return null;
      },
    });

    if (newStatus) {
      try {
        setIsLoading(true);
        await api.put(`/orders/${orderId}`, { status: newStatus });
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order status updated successfully',
          confirmButtonColor: '#1a3d60',
        });
      } catch (err) {
        console.error('Update failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update order status',
          confirmButtonColor: '#1a3d60',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!order && !isLoading) {
    return (
      <section className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          Order Not Found
        </h1>
        <Link href="/dashboard/orders">
          <Button variant="outline-primary">Back to Orders</Button>
        </Link>
      </section>
    );
  }

  const { subtotal, totalDiscount, totalAmount } = calculateTotals();

  return (
    <>
      {isLoading && <Loader />}
      <section className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
            Order Details
          </h1>
          <div className="flex flex-col-reverse md:flex-row gap-2">
            <Link href="/dashboard/orders">
              <Button
                variant="outline-primary"
                className="flex items-center gap-2 truncate"
              >
                <FaArrowLeft className="w-4 h-4" /> Back to Orders
              </Button>
            </Link>
          </div>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Order Information
                </h2>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={OrderStatusBadge(order)}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleUpdateStatus}
                    className="ml-1 w-8 h-6 inline-flex items-center justify-center"
                  >
                    <FaPen className="w-4 h-4" />
                  </Button>
                </p>
                <p>
                  <strong>Total Amount:</strong> {totalAmount} L.E
                </p>
                <p>
                  <strong>Order Date:</strong>{' '}
                  {formatDate(order.orderDate, true)}
                </p>
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {formatDate(order.updatedAt, true)}
                </p>
              </div>

              {/* Customer Info */}
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Customer Information
                </h2>
                <p>
                  <strong>Username:</strong> {order.user.username}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {order.phoneNumber}
                </p>
                {order.secondaryPhoneNumber && (
                  <p>
                    <strong>Secondary Phone:</strong>{' '}
                    {order.secondaryPhoneNumber}
                  </p>
                )}
                {order.address && (
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                Order Summary
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
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
            </div>

            {/* Products List */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                Products
              </h2>
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
                    {order.products.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
                      >
                        <td className="py-2 px-4 border-b text-sm">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {item.product.name}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {(item.price + (item.discount || 0)).toFixed(2)} L.E
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {(item.discount || 0).toFixed(2)} L.E
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {((item.discount || 0) * item.quantity).toFixed(2)}{' '}
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
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default OrderDetailsPage;
