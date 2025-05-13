"use client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { deleteAccount } from "@/api/account";
import Loader from "@/components/ui/Loader";
import { useAccountContext } from "@/context/AccountContext";

import Image from "next/image";

const ProfilePage = () => {
  const { user, loading } = useAccountContext();
  const handleDeleteAccount = async () => {
    const { value: inputValue } = await Swal.fire({
      title: `Enter "${user?.username}" to confirm deletion`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: (input) => {
        if (!input) {
          Swal.showValidationMessage("Please enter your username");
          return false;
        } else if (input !== user?.username) {
          Swal.showValidationMessage("Wrong username");
          return false;
        }
        return true;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (inputValue) {
      try {
        await deleteAccount();
        Swal.fire("Account deleted successfully");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.replace("/");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete account", "error");
      }
    }
  }; // handleDeleteAccount
  
  const roleMap = {
    1995: "Admin",
    1996: "Seller",
    2004: "User",
  };

  return (
    <>
      {loading && <Loader />}
      <div className="bg-primary-100">
        <div className="container h-[calc(100vh-74px)]">
          <h1 className="text-4xl font-bold mb-4 pt-16 text-center text-primary-900">Your Profile</h1>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <Image
                  src={user?.image || "/images/default-profile.jpg"}
                  alt={user?.username || `${process.env.NEXT_PUBLIC_SITE_NAME} User`}
                  width={200}
                  height={200}
                  className="h-80 md:h-48 w-full object-cover md:w-48 select-none"
                />
              </div>
              <div className="p-8">
                <div className="tracking-wide text-xl text-slate-900 font-semibold">
                  {user?.username || "Unknown User"}
                </div>
                <p className="block mt-1 text-md leading-tight font-medium text-gray-500">
                  {user?.email || "No Email Available"}
                </p>
                <p className="mt-4 text-gray-500">
                  {process.env.NEXT_PUBLIC_SITE_NAME} {roleMap[user?.role] || "Unknown Role"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 max-w-md gap-4 md:max-w-2xl mx-auto">
            <Button variant="outline-primary">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>

            <Button variant="danger" onClick={() => handleDeleteAccount()}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
