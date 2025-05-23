'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getProductById } from '@/api/products';
import Button from '@/components/ui/Button';
import CartModal from '@/components/ui/CartModal';
import { FaArrowLeft } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import api from '@/lib/axiosInterceptor';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const ProductSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d1d5db" highlightColor="#e5e7eb">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[calc(100vh-72px)]">
        <Skeleton width={120} height={20} className="mb-4 sm:mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Skeleton for Product Images */}
          <div className="space-y-4">
            <Skeleton
              height={300}
              className="sm:h-[400px] lg:h-[500px] rounded-lg"
            />
            <div className="mt-2 sm:mt-4 flex space-x-1">
              {Array(4)
                .fill()
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    width={60}
                    height={60}
                    className="sm:w-[80px] sm:h-[80px] rounded-md"
                  />
                ))}
            </div>
          </div>
          {/* Skeleton for Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <Skeleton
              width={300}
              height={36}
              className="sm:h-[48px] lg:h-[56px]"
            />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Skeleton width={80} height={24} />
              <Skeleton width={60} height={20} />
              <Skeleton width={100} height={16} />
            </div>
            <Skeleton count={3} height={16} />
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={20} />
            <Skeleton width={120} height={20} />
            <Skeleton width={140} height={20} />
            <Skeleton width={200} height={40} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

const ProductPage = ({ params }) => {
  const { productId } = React.use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId);
        const data = response.data;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    console.log('Loading state:', loading); // Debug loading state
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async ({ size, color, quantity }) => {
    // Check if user is logged in by checking for token in localStorage
    const token = Cookies.get('accessToken') || Cookies.get('refreshToken');
    if (!token) {
      // Redirect to login page with current URL as redirect query
      const redirectUrl = `/products/${productId}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity,
        size,
        color,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Item added to cart successfully!',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to add item to cart';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        customClass: {
          popup: 'bg-primary-50 text-primary-900',
          confirmButton: 'bg-primary-600 text-white px-4 py-2 rounded',
        },
      });
    }
  };

  if (loading) {
    return <ProductSkeleton key="skeleton" />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-tertiary-700">
        Product not found
      </div>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? (product.price - product.discount).toFixed(1)
      : product.price.toFixed(2);

  const mainSliderSettings = {
    dots: false,
    infinite: product.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    asNavFor: nav2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const thumbnailSliderSettings = {
    dots: false,
    infinite: product.images.length > Math.min(product.images.length, 6),
    speed: 500,
    slidesToShow: Math.min(product.images.length, 6),
    slidesToScroll: 1,
    arrows: false,
    asNavFor: nav1,
    focusOnSelect: true,
    autoplay: product.images.length > Math.min(product.images.length, 6),
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerPadding: '0px',
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(product.images.length, 5),
          infinite: product.images.length > Math.min(product.images.length, 5),
          autoplay: product.images.length > Math.min(product.images.length, 5),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(product.images.length, 4),
          infinite: product.images.length > Math.min(product.images.length, 4),
          autoplay: product.images.length > Math.min(product.images.length, 4),
        },
      },
    ],
  };

  const handleThumbnailClick = (index) => {
    if (slider1.current) {
      slider1.current.slickGoTo(index);
    }
  };

  return (
    <section className="bg-primary-50">
      <style jsx>{`
        .slick-slide {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[calc(100vh-72px)]">
        <Link href="/products">
          <Button
            variant="outline-primary"
            className="mb-4 flex items-center justify-center gap-2"
          >
            <FaArrowLeft />
            Back to Products
          </Button>
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <>
                <Slider
                  {...mainSliderSettings}
                  ref={slider1}
                  className="rounded-lg overflow-hidden"
                >
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]"
                    >
                      <Image
                        src={image || '/images/product-placeholder.jpg'}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </Slider>
                {product.images.length > 1 && (
                  <Slider
                    {...thumbnailSliderSettings}
                    ref={slider2}
                    className="mt-2 sm:mt-4"
                  >
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="inline-block w-[60px] sm:w-[80px] mx-0.5 box-content"
                      >
                        <div
                          className="relative w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] aspect-square cursor-pointer"
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <Image
                            src={image || '/images/product-placeholder.jpg'}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover rounded-md border border-secondary-200 hover:border-primary-400 transition-colors slick-current:border-primary-600 slick-current:bg-primary-50 shadow-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                )}
              </>
            ) : (
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-secondary-100 flex items-center justify-center rounded-lg text-secondary-600">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-2">
            <div>
              <Link href={`/categories/${product.category?._id}`}>
                <span className="text-secondary-700 hover:text-secondary-500 transition-colors">
                  In {product.category?.name || 'Unknown'}
                </span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900">
              {product.name}
            </h1>
            <p className="text-secondary-700 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-6 sm:mt-8">
              {product.discount > 0 ? (
                <>
                  <span className="text-2xl font-semibold text-primary-500">
                    {discountedPrice} EGP
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {product.price.toFixed(1)} EGP
                  </span>
                  <span className="text-base text-primary-900 ml-2">
                    ({Math.round((product.discount / product.price) * 100)}%
                    off)
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-primary-600">
                  {product.price.toFixed(1)} EGP
                </span>
              )}
            </div>

            {product.stock < 5 && product.stock > 0 && (
              <div className="mt-2">
                <span className="font-semibold text-black">Stock: </span>
                <span className="text-red-600">
                  Only {product.stock} available
                </span>
              </div>
            )}
            {product.size.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-black">Sizes:</span>
                <div className="flex items-center gap-1">
                  {product.size.map((size, index) => (
                    <span
                      key={index}
                      className="bg-primary-200 text-primary-900 text-sm px-2 py-1 rounded-md"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-black">Colors:</span>
                <div className="flex items-center gap-1">
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="w-5 h-5 rounded-full border border-primary-200 inline-block"
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="mr-auto w-full sm:w-1/3 mt-6 sm:mt-8"
              disabled={product.stock === 0}
              onClick={() => setIsModalOpen(true)}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
};

export default ProductPage;
