import { FaBoxes, FaCartArrowDown, FaInfoCircle, FaSitemap, FaUser } from "react-icons/fa";

const iconClass = "text-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110";

export const navLinks = [
  {
    title: 'users',
    icon: <FaUser  className={iconClass}/>,
    link: 'users',
    role: [1995]
  },
  {
    title: 'categories',
    icon: <FaSitemap  className={iconClass}/>,
    link: 'categories',
    role: [1995, 1996]
  },
  {
    title: 'products',
    icon: <FaBoxes  className={iconClass}/>,
    link: 'products',
    role: [1995, 1996]
  },
  {
    title: 'orders',
    icon: <FaCartArrowDown className={iconClass}/>,
    link: 'orders',
    role: [1995, 1996]
  },
  {
    title: 'settings',
    icon: <FaInfoCircle  className={iconClass}/>,
    link: 'settings',
    role: [1995]
  }
]