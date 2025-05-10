"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/ui/dashboard/DataTable";
import Button from "@/components/ui/Button";
import { FaPen, FaEye, FaTrash } from "react-icons/fa6";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "@/lib/axiosInterceptor";
import { getPaginatedOrders } from "@/api/orders";
import { formatDate } from "@/lib/formatDate";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await getPaginatedOrders(currentPage, itemsPerPage);
        setOrders(res.data.data);
        setTotalItems(res.data.totalItems);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching orders:", err);
        Swal.fire("Error", "Failed to fetch orders", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const validStatuses = ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"];
    const { value: newStatus } = await Swal.fire({
      title: "Update Order Status",
      input: "select",
      inputOptions: validStatuses.reduce(
        (acc, status) => {
          acc[status] = status.charAt(0).toUpperCase() + status.slice(1);
          return acc;
        },
        {}
      ),
      inputValue: currentStatus,
      inputPlaceholder: "Select status",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#1a3d60",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a status!";
        }
        if (value === currentStatus) {
          return "Please select a different status!";
        }
        return null;
      },
    });

    if (newStatus) {
      try {
        setIsLoading(true);
        await api.put(`/orders/${orderId}`, { status: newStatus });
        setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
        Swal.fire("Success", "Order status updated successfully", "success");
      } catch (err) {
        console.error("Update failed", err);
        Swal.fire("Error", "Failed to update order status", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await api.delete(`/orders/${orderId}`);
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
          setTotalItems((prev) => (prev > 0 ? prev - 1 : 0));
          setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
          Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (err) {
          console.error("Delete failed", err);
          Swal.fire("Error", "Failed to delete order", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      key: "orderId",
      header: "Order ID",
      render: (order) => {
        return `*****${order._id.slice(-6)}`;
      }, // Show last 6 chars of ID
    },
    {
      key: "user",
      header: "Customer",
      render: (order) => order.user.username,
    },
    {
      key: "phoneNumber",
      header: "Phone Number",
      render: (order) => order.phoneNumber.slice(0, 6) + "*****",
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (order) => `${order.totalAmount.toFixed(1)} L.E`,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "confirmed"
                ? "bg-violet-100 text-violet-800"
                : order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
          }`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      ),
    },
    {
      key: "orderDate",
      header: "Order Date",
      render: (order) => formatDate(order.orderDate, true),
    },
  ];

  const actions = (order) => (
    <>
      <Link href={`/dashboard/orders/${order._id}`}>
        <Button variant="outline-primary" size="sm" className="w-8 h-8">
          <FaEye className="w-4 h-4" />
        </Button>
      </Link>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => handleUpdateStatus(order._id, order.status)}
        className="w-8 h-8">
        <FaPen className="w-4 h-4" />
      </Button>
      <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)} className="w-8 h-8">
        <FaTrash className="w-4 h-4" />
      </Button>
    </>
  );

  return (
    <>
      {isLoading && <Loader />}
      <section className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">Orders</h1>
        </motion.div>
        <DataTable
          data={orders}
          columns={columns}
          keyExtractor={(order) => order._id}
          actions={actions}
          noDataMessage="No orders found."
          totalItems={totalItems}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </section>
    </>
  );
};

export default OrdersPage;
