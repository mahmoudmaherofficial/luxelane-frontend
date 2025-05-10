"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, updateUser } from "@/api/users";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import { motion } from "framer-motion";

const EditUserPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: 2004,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(userId);
        setFormData({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(userId, formData);
      toast.success("User updated successfully!");
      router.push("/dashboard/users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { type: "text", name: "username", label: "Username", required: true, minLength: 4, pattern: "^[a-z_][a-z0-9_]*$" },
    { type: "email", name: "email", label: "Email", required: true, pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" },
  ];

  return (
    <>
      {loading && <Loader />}
      <section className="min-h-screen bg-primary-50 p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-primary-900">
          <h2 className="text-2xl font-bold mb-4 ">Edit User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map((field) => (
              <div key={field.name}>
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`w-full border border-slate-300 rounded px-3 py-2 ${field.className}`}
                  required
                  label={field.label}
                  pattern={field.pattern}
                  minLength={field.minLength}
                />
              </div>
            ))}
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2">
                <option value={1995}>Admin</option>
                <option value={1996}>Product Manager</option>
                <option value={2004}>User</option>
              </select>
            </div>
            <Button type="submit">Update</Button>
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default EditUserPage;

