'use client';

import { useEffect, useState } from 'react';
import { deleteProduct, getPaginatedProducts } from '@/api/products';
import DataTable from '@/components/ui/dashboard/DataTable';
import Button from '@/components/ui/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { formatDate } from '@/lib/formatDate';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getPaginatedProducts(currentPage, itemsPerPage);
        if (!res.data) {
          throw new Error('No data returned from API');
        }
        setProducts(res.data.data || []);
        setTotalItems(res.data.totalItems);
        setTotalPages(res.data.totalPages);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Could not fetch products.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage]);

  const handleDeleteProduct = async (id) => {
    if (!id || !products.find((p) => p._id === id)) {
      return Swal.fire('Error!', 'Product not found.', 'error');
    }
    const productName = products.find((p) => p._id === id)?.name;
    const result = await Swal.fire({
      title: `Delete ${productName}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
        setTotalItems((prev) => (prev > 0 ? prev - 1 : 0));
        setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
        Swal.fire('Deleted!', `${productName} has been deleted.`, 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Could not delete product.', 'error');
      }
    }
  };

  const columns = [
    {
      key: 'category',
      header: 'Category',
      render: (row) => row.category?.name || row.category || 'N/A',
    },
    {
      key: 'name',
      header: 'Name',
      render: (row) => {
        return <p className="truncate max-w-40">{row.name}</p>;
      },
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => {
        return <p className="truncate max-w-50">{row.description}</p>;
      },
    },
    { key: 'price', header: 'Price' },
    { key: 'discount', header: 'Discount' },
    { key: 'stock', header: 'Stock' },
    {
      key: 'size',
      header: 'Available Size',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.size?.map((size, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-900"
            >
              {size}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'colors',
      header: 'Available Color',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.colors?.map((color, index) => (
            <span
              key={index}
              className={`w-6 h-6 rounded-full border border-primary-200`}
              style={{ backgroundColor: color }}
            ></span>
          ))}
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Image',
      render: (row) => (
        <div className="flex space-x-2">
          {row.images?.length > 0 ? (
            <img
              src={row.images[0]}
              alt={row.name}
              width={32}
              height={32}
              loading="lazy"
            />
          ) : (
            <img
              src="/images/image-placeholder.png"
              alt="placeholder"
              width={32}
              height={32}
              loading="lazy"
            />
          )}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (row) => formatDate(row.updatedAt, true),
    },
    {
      key: 'createdBy',
      header: 'Created By',
      render: (row) => row.createdBy?.username || 'N/A',
    },
  ];

  const actions = (product) => (
    <>
      <Link href={`/dashboard/products/${product._id}/edit`}>
        <Button variant="outline-primary" size="sm" className="w-8 h-8">
          <FaEdit className="w-4 h-4" />
        </Button>
      </Link>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDeleteProduct(product._id || '')}
        className="w-8 h-8"
      >
        <FaTrash className="w-4 h-4" />
      </Button>
    </>
  );

  return (
    <>
      {loading && <Loader />}
      <section className="p-4 md:p-6 lg:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
            Products
          </h1>
          <Link href="/dashboard/products/create">
            <Button variant="outline-primary">Add Product</Button>
          </Link>
        </motion.div>
        <DataTable
          data={products}
          columns={columns}
          keyExtractor={(product) => product._id || ''}
          actions={actions}
          noDataMessage="No products found."
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
export default ProductsPage;
