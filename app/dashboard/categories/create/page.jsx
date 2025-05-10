"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory as createCategoryApi } from "@/api/categories";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import { motion } from "framer-motion";
import Loader from "@/components/ui/Loader";

const CreateCategoryPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createCategoryApi(formData);
      toast.success("Category created successfully!");
      router.push("/dashboard/categories");
    } catch (err) {
      toast.error(err.response.data.error || "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-4 md:p-6 lg:p-8 bg-primary-50 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-primary-900">
        <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} required label="Name" />
            </div>
            <div>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                label="Description"
              />
            </div>
            <Button type="submit">Create Category</Button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default CreateCategoryPage;

