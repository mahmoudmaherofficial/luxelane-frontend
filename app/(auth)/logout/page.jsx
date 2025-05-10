"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";

const logoutFn = async () => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
  return { success: true };
};

const LogoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutFn();
      Cookies.remove("accessToken"); // Remove only if accessToken is not httpOnly
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLogout().then(() => {
      window.location.replace("/");
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      {loading && <p className="text-primary-500 text-lg">Logging out, please wait...</p>}
      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
          <Button
            onClick={handleLogout}
            className="mt-4 bg-primary-500 hover:bg-primary-600 text-white"
            disabled={loading}>
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LogoutPage;
