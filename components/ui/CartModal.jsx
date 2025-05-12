import { useState } from "react";
import Button from "./Button";
import { motion } from "framer-motion";

const CartModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color.');
      return;
    }
    if (selectedQuantity < 1 || selectedQuantity > product.stock) {
      alert(`Please select a quantity between 1 and ${product.stock}.`);
      return;
    }
    onAddToCart({
      size: selectedSize,
      color: selectedColor,
      quantity: selectedQuantity,
    });
    setSelectedSize('');
    setSelectedColor('');
    setSelectedQuantity(1);
    onClose();
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = selectedQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setSelectedQuantity(newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50 -z-1"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-primary-50 p-6 rounded-lg shadow-lg max-w-md w-full m-4 sm:m-0"
      >
        <h2 className="text-xl font-bold text-primary-900 mb-4">
          Select Size, Color, and Quantity
        </h2>
        <div className="mb-4">
          <label className="block text-secondary-700 font-semibold mb-2">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.size.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedSize === size
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-200 text-primary-900 hover:bg-primary-300'
                } transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-secondary-700 font-semibold mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-primary-600'
                    : 'border-primary-200'
                }`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-secondary-700 font-semibold mb-2">
            Quantity (Available: {product.stock})
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="w-8 h-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={selectedQuantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-1 w-14 bg-primary-100 text-primary-900 rounded-full">
              {selectedQuantity}
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              className="w-8 h-8"
              onClick={() => handleQuantityChange(1)}
              disabled={selectedQuantity >= product.stock}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline-primary"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="px-4 py-2"
            disabled={!selectedSize || !selectedColor}
          >
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
export default CartModal;