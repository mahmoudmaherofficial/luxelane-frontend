import "@/app/styles/dashboard.css";
import { BsArrowUpRight, BsPersonCircle, BsBox, BsCreditCard, BsGear } from "react-icons/bs";
import { FiShoppingBag, FiUsers, FiBarChart2, FiImage, FiGrid, FiHelpCircle, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <section className="p-4 md:p-6 lg:p-8">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-black)] mb-2">Welcome to your Dashboard</h1>
            <p className="text-[var(--color-tertiary-800)]">Manage your store and access all functionality from here</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-4 text-right hidden md:block">
              <p className="font-medium text-[var(--color-black)]">Alex Smith</p>
              <p className="text-[var(--color-tertiary-600)] text-sm">Store Owner</p>
            </div>
            <div className="bg-[var(--color-primary-600)] w-10 h-10 rounded-full text-[var(--color-white)] flex items-center justify-center">
              <BsPersonCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Main Dashboard Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Products",
              description: "Manage your product catalog and inventory",
              icon: <FiShoppingBag className="h-10 w-10" />,
              color: "bg-[var(--color-primary-500)]",
              route: "/dashboard/products",
              items: "245 products",
            },
            {
              title: "Orders",
              description: "View and manage customer orders",
              icon: <BsBox className="h-10 w-10" />,
              color: "bg-[var(--color-tertiary-600)]",
              route: "/dashboard/orders",
              items: "18 new orders",
            },
            {
              title: "Customers",
              description: "View customer profiles and history",
              icon: <FiUsers className="h-10 w-10" />,
              color: "bg-[var(--color-secondary-500)]",
              route: "/dashboard/customers",
              items: "1.2k customers",
            },
            {
              title: "Analytics",
              description: "Track performance metrics and insights",
              icon: <FiBarChart2 className="h-10 w-10" />,
              color: "bg-[var(--color-tertiary-500)]",
              route: "/dashboard/analytics",
              items: "Real-time data",
            },
            {
              title: "Payments",
              description: "Manage transactions and payment methods",
              icon: <BsCreditCard className="h-10 w-10" />,
              color: "bg-[var(--color-primary-700)]",
              route: "/dashboard/payments",
              items: "Secure processing",
            },
            {
              title: "Settings",
              description: "Configure your store preferences",
              icon: <BsGear className="h-10 w-10" />,
              color: "bg-[var(--color-secondary-700)]",
              route: "/dashboard/settings",
              items: "Store settings",
            },
          ].map((item, index) => (
            <Link href={item.route} key={index} className="group hover-lift card-shine">
              <div
                className="bg-[var(--color-white)] rounded-xl border border-[var(--color-tertiary-100)] overflow-hidden transition-all duration-300"
                style={{ "--item-index": index }}>
                <div className={`h-3 ${item.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className={`rounded-lg p-3 text-[var(--color-white)] ${item.color} mr-4`}>{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-black)] group-hover:text-[var(--color-primary-600)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[var(--color-tertiary-700)] mb-2">{item.description}</p>
                      <div className="flex items-center text-sm text-[var(--color-tertiary-500)]">
                        <span>{item.items}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <div className="rounded-full bg-[var(--color-tertiary-50)] w-8 h-8 flex items-center justify-center group-hover:bg-[var(--color-primary-50)] transition-colors">
                      <BsArrowUpRight className="h-4 w-4 text-[var(--color-tertiary-400)] group-hover:text-[var(--color-primary-600)] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions Row */}
        <div className="bg-[var(--color-white)] rounded-xl shadow-dashboard p-6 mb-10">
          <h2 className="text-xl font-bold text-[var(--color-black)] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                title: "Add Product",
                icon: <FiShoppingBag className="h-5 w-5" />,
                color: "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]",
                route: "/dashboard/products/new",
              },
              {
                title: "Content",
                icon: <FiImage className="h-5 w-5" />,
                color: "bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]",
                route: "/dashboard/content",
              },
              {
                title: "Categories",
                icon: <FiGrid className="h-5 w-5" />,
                color: "bg-[var(--color-tertiary-100)] text-[var(--color-tertiary-600)]",
                route: "/dashboard/categories",
              },
              {
                title: "Support",
                icon: <FiMessageSquare className="h-5 w-5" />,
                color: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
                route: "/dashboard/support",
              },
              {
                title: "Help Center",
                icon: <FiHelpCircle className="h-5 w-5" />,
                color: "bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)]",
                route: "/dashboard/help",
              },
              {
                title: "Settings",
                icon: <BsGear className="h-5 w-5" />,
                color: "bg-[var(--color-tertiary-100)] text-[var(--color-tertiary-700)]",
                route: "/dashboard/settings",
              },
            ].map((item, index) => (
              <Link
                href={item.route}
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-[var(--color-tertiary-100)] hover:border-[var(--color-primary-200)] hover:shadow-sm cursor-pointer transition-all duration-300 card-shine">
                <div className={`rounded-full p-3 mb-2 ${item.color}`}>{item.icon}</div>
                <span className="font-medium text-[var(--color-black)]">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Illustrations Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-tertiary-600)] rounded-xl shadow-dashboard p-6 text-[var(--color-white)]">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-2xl font-bold mb-2">Get the most out of your store</h2>
              <p className="text-[var(--color-primary-100)] mb-4">
                Customize your dashboard, manage products, and track your business growth all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/guide"
                  className="bg-[var(--color-white)] text-[var(--color-primary-600)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-50)] transition-colors inline-flex items-center">
                  View Guide
                </Link>
                <Link
                  href="/dashboard/help"
                  className="bg-[var(--color-primary-400)] bg-opacity-30 text-[var(--color-white)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-40 transition-colors inline-flex items-center">
                  Get Help
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-[var(--color-white)] bg-opacity-20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[var(--color-white)] bg-opacity-20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-white)] flex items-center justify-center">
                    <FiShoppingBag className="h-12 w-12 text-[var(--color-primary-600)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

