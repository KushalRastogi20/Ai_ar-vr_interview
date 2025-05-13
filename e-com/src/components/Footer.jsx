'use client';

import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-blue-600">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white">Subscribe to our Newsletter</h3>
              <p className="text-blue-100">Get the latest updates and offers directly to your inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">About SHOPHUB</h2>
            <p className="mb-4 text-gray-400">
              We offer a premium shopping experience with the best selection of products at competitive prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <motion.a 
                whileHover={{ y: -3, color: '#1DA1F2' }}
                href="#" 
                className="text-gray-400 hover:text-white"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3, color: '#3b5998' }}
                href="#" 
                className="text-gray-400 hover:text-white"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3, color: '#E1306C' }}
                href="#" 
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3, color: '#0e76a8' }}
                href="#" 
                className="text-gray-400 hover:text-white"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Shop</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Customer Service</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">My Account</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Order History</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Wishlist</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Contact Info</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-blue-400" />
                <span>123 Commerce St, New York, NY 10001, USA</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-blue-400" />
                <span>support@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 SHOPHUB. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <img src="/api/placeholder/200/30" alt="Payment Methods" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}