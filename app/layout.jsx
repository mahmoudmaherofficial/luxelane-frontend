import { Merriweather_Sans } from "next/font/google";
import "./styles/globals.css";
import "./styles/tailwind.css";
import { ToastContainer } from "react-toastify";
import { AccountProvider } from "@/context/AccountContext";
import MainNavbarWrapper from "@/components/wrappers/MainNavbarWrapper";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "Luxury Fashion"}`, // Fallback for undefined env
    default: process.env.NEXT_PUBLIC_SITE_NAME || "Luxury Fashion",
  },
  description:
    "Your one-stop destination for luxury fashion and accessories. Shop the latest trends and exclusive collections today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css" />
      </head>
      <body className={`${merriweatherSans.className} overflow-x-hidden`}>
        <AccountProvider>
          <MainNavbarWrapper>
            <main>
              <ToastContainer />
              {children}
            </main>
          </MainNavbarWrapper>
        </AccountProvider>
      </body>
    </html>
  );
}
