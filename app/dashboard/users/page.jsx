"use client";

import { getPaginatedUsers } from "@/api/users";
import { getAccount } from "@/api/account";
import api from "@/lib/axiosInterceptor";
import { useEffect, useState } from "react";
import DataTable from "@/components/ui/dashboard/DataTable";
import Button from "@/components/ui/Button";
import { FaPen, FaTrash } from "react-icons/fa6";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const currentUserRes = await getAccount();
        setCurrentUserId(currentUserRes.data._id);

        const res = await getPaginatedUsers(currentPage, itemsPerPage);
        const fetchedUsers = res.data.data;

        const sortedUsers = fetchedUsers.sort((a, b) =>
          a._id === currentUserRes.data._id ? -1 : b._id === currentUserRes.data._id ? 1 : 0
        );
        setUsers(sortedUsers);
        setTotalItems(res.data.totalItems);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await api.delete(`/users/${userId}`);
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        setTotalItems((prev) => (prev > 0 ? prev - 1 : 0));
        setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage)); // Recalculate totalPages after deletion
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error", "Failed to delete user", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = [
    {
      key: "username",
      header: "Name",
      render: (user) => (user._id === currentUserId ? `${user.username} (You)` : user.username),
    },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
  ];

  const actions = (user) => (
    <>
      <Link href={`/dashboard/users/${user._id}/edit`}>
        <Button variant="outline-primary" size="sm" className="w-8 h-8">
          <FaPen className="w-4 h-4" />
        </Button>
      </Link>
      {user._id !== currentUserId && (
        <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)} className="w-8 h-8">
          <FaTrash className="w-4 h-4" />
        </Button>
      )}
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">Users</h1>
          <Link href={"/dashboard/users/create"}>
            <Button variant="outline-primary">Add User</Button>
          </Link>
        </motion.div>
        <DataTable
          data={users}
          columns={columns}
          keyExtractor={(user) => user._id}
          actions={actions}
          noDataMessage="No users found."
          roleMap={{
            1995: "Admin",
            1996: "Product Manager",
            2004: "User",
          }}
          currentUserId={currentUserId}
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

export default UsersPage;

