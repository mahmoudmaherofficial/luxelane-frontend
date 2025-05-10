"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/api/users";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { motion } from "framer-motion";

const CreateUserPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState([
    { name: "username", value: "", type: "text", pattern: "^[a-z_][a-z0-9_]*$" },
    { name: "email", value: "", type: "email", pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" },
    { name: "password", value: "", type: "password" },
    { name: "role", value: 2004, type: "select" },
  ]);
  const router = useRouter();

  const handleInputChange = (index, value) => {
    setUserDetails((prev) => prev.map((item, i) => (i === index ? { ...item, value } : item)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await createUser(
        userDetails.reduce((prev, item) => {
          prev[item.name] = item.value;
          return prev;
        }, {})
      );
      toast.success("User created successfully!");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="bg-primary-50 min-h-full p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 max-w-xl bg-white mx-auto rounded-xl shadow-md text-primary-900">
          <h2 className="text-2xl font-bold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {userDetails.map((item, index) => (
              <div key={item.name}>
                {item.type === "select" && (
                  <label className="block mb-1 font-medium" htmlFor={item.name}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </label>
                )}
                {item.type === "select" ? (
                  <select
                    id={item.name}
                    name={item.name}
                    value={item.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2">
                    <option value={1995}>Admin</option>
                    <option value={1996}>Product Manager</option>
                    <option value={2004}>User</option>
                  </select>
                ) : (
                  <Input
                    type={item.type}
                    name={item.name}
                    value={item.value}
                    label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    required
                    pattern={item.pattern}
                  />
                )}
              </div>
            ))}
            <Button type="submit">Create User</Button>
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default CreateUserPage;

