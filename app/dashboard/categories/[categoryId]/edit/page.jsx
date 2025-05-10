"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategoryById, updateCategory } from "@/api/categories";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import { motion } from "framer-motion";

const EditCategoryPage = () => {
  const { categoryId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const res = await getCategoryById(categoryId);
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateCategory(categoryId, formData);
      toast.success("Category updated successfully!");
      router.push("/dashboard/categories");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-4 md:p-6 lg:p-8 bg-primary-50 min-h-full">
      {isLoading && <Loader />}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              label="Category Name"
            />
          </div>
          <div>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              label="Category Description"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Update
          </Button>
        </form>
      </motion.div>
    </section>
  );
};

export default EditCategoryPage;
