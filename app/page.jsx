'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountContext } from '@/context/AccountContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/app/styles/slick-custom.css';
import ProductCard from '@/components/ui/ProductCard';
import { getAllProducts } from '@/api/products';
import CategoryLink from '@/components/ui/CategoryLink';
import { getAllCategories } from '@/api/categories';

const HomePage = () => {
  const { user, loading } = useAccountContext();
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await getAllProducts();
        const { data } = res;
        setFeaturedProducts(data.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        const { data } = res;
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleShopNow = () => {
    router.push('/shop');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    centerMode: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <main className="text-primary-900 bg-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[calc(100vh-74px)] flex items-center select-none justify-center text-white"
      >
        <Image
          src="/images/hero.webp"
          alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Fashion`}
          fill
          priority
          className="brightness-40 h-screen w-full object-cover"
        />
        <div className="absolute text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0, width: 0 }}
            animate={{ y: 0, opacity: 1, width: '100%' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto overflow-hidden"
          >
            {user && (
              <>
                <span className="whitespace-nowrap overflow-hidden inline-block">{`Hello, ${user.username} ! `}</span>
                <br />
              </>
            )}
            <span className="whitespace-nowrap overflow-hidden inline-block">
              Curated elegance for every style.
            </span>
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button onClick={handleShopNow} size="lg">
              Discover Now
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary-900"
          >
            Our Favorites
          </motion.h2>
          {loading ? (
            <p className="text-center text-primary-900">Loading...</p>
          ) : (
            <Slider {...sliderSettings} className="mx-4">
              {featuredProducts.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={product.id}
                  className="p-4 "
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary-900"
          >
            Shop Your Style
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <CategoryLink category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-black border-t"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Stay in Style with {process.env.NEXT_PUBLIC_SITE_NAME}
          </h2>
          <p className="text-primary-200 mb-6 max-w-lg mx-auto">
            {user
              ? 'Explore your personalized fashion journey.'
              : 'Join our community for exclusive offers.'}
          </p>
          <Button onClick={() => router.push(user ? '/profile' : '/register')}>
            {user ? 'Go to Profile' : 'Join Now'}
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default HomePage;
