'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import { FaCartPlus } from 'react-icons/fa6';

const ProductCard = ({ product }) => {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="relative border border-primary-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
        <div className="absolute top-4 left-4">
          {product.discount > 0 && product.discount / product.price >= 0.05 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary-900 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              Save {Math.floor((product.discount / product.price) * 100)}%
            </motion.div>
          )}
        </div>
        {product.stock <= 5 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
        <Image
          src={product.images[0]}
          alt={product.name}
          width={320}
          height={400}
          className="w-full h-80 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-semibold text-primary-900 truncate">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2 truncate">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                {product.colors?.map((color, index) => (
                  <span
                    key={index}
                    className={`w-6 h-6 rounded-full border border-primary-200`}
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-primary-500 font-semibold text-lg">
                  {product.discount > 0
                    ? (product.price - product.discount).toFixed(1)
                    : product.price?.toFixed(1)}{' '}
                  EGP
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {product.price?.toFixed(1)} EGP
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                console.log(product);
              }}
            >
              <FaCartPlus className="text-xl" />
            </Button>
          </div>
          {/* <Link href={`/products/${product.id}`}>
						<Button className="mt-4 w-full">Show Details</Button>
					</Link> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
