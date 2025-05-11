import Link from 'next/link';
import React from 'react';

const CategoryLink = ({ category }) => {
  return (
    <Link
      href={`/shop?category=${category.name?.toLowerCase()}`}
      className="w-24 h-24 md:w-32 p-2 md:h-32 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-100 transition-colors"
      aria-label={`Shop ${category.name}`}
    >
      <span className="text-primary-900 font-semibold text-lg overflow-hidden whitespace-nowrap text-ellipsis">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryLink;
