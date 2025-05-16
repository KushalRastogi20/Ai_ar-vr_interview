'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/utils/axios';
const ProductPage = ({ params }) => {
  // In a real app, you would fetch this data based on params.id
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

useEffect(() => {
  const fetchProduct = async () => {
    setLoading(true);
    try {
      console.log("params.id", params.id);
      const response = await api.get(`/api/products/${params.id}`);
      console.log("response", response);

      // ✅ Proper way to access data from Axios
      const data = response.data;

      setProduct(data.data);
      console.log("product check", data.product);
      setRelatedProducts(data.relatedProducts);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  fetchProduct();
}, [params.id]);


  const nextImage = () => {
    if (!product || product.images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!product || product.images.length <= 1) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const addToCart = () => {
    // In a real app, implement cart functionality
    alert(`Added ${product.name} ${selectedSize ? `in size ${selectedSize}` : ''} to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <p className="text-green-800">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <p className="text-red-500">Product not found</p>
      </div>
    );
  }

  const hasMultipleImages = product.images && product.images.length > 1;
  const isClothing = product.category === 'clothing' && product.sizes && product.sizes.length > 0;

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 relative">
              {/* Image carousel */}
              <div className="relative h-96 w-full bg-purple-100">
                {/* <Image 
                  // src={product.images[currentImageIndex]} 
                  src="https://via.placeholder.com/400" // Placeholder for demo
                  alt={product.name}
                  fill
                  className="object-contain"
                /> */}
                
                {/* Only show carousel controls if multiple images */}
                {hasMultipleImages && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-800 bg-opacity-70 text-white p-2 rounded-full"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-800 bg-opacity-70 text-white p-2 rounded-full"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            currentImageIndex === index ? 'bg-green-800' : 'bg-purple-300'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <div className="uppercase text-purple-600 text-sm font-bold">
                {product.category}
              </div>
              <h1 className="text-3xl font-bold text-green-900 mt-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-green-800 mt-2">${product.price.toFixed(2)}</p>
              
              <div className="mt-4 text-gray-600">
                <p>{product.description}</p>
              </div>
              
              {/* Product details in a list */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-green-800">Product Details</h3>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  {product.details?.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
              
              {/* Size selector for clothing */}
              {isClothing && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-green-800">Select Size</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md ${
                          selectedSize === size
                            ? 'border-green-800 bg-green-800 text-white'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to cart button */}
              <button
                onClick={addToCart}
                disabled={isClothing && !selectedSize}
                className="mt-8 w-full bg-green-800 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isClothing && !selectedSize ? 'Please select a size' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-green-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  href={`/product/${relatedProduct.id}`} 
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-64 relative">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-green-800">{relatedProduct.name}</h3>
                    <p className="text-purple-600 font-medium mt-1">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;