import { Poppins } from "next/font/google";
import "./styles/globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/authContext";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  // variable: "--font-poppins",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Luxe Lane",
  description: "Online clothing store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css"
        />
      </head>
      <body
        className={`${poppins.className} antialiased`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
