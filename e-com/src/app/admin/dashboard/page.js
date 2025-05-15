"use client";
import { useState, useEffect } from "react";
import {
  PenLine,
  Plus,
  Trash2,
  Search,
  X,
  Filter,
  ArrowUpDown,
  Image as ImageIcon,
  ChevronDown,
  Info,
} from "lucide-react";
import api from "@/utils/axios";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [],
    imageUrl: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
    sizes: [],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categories = Array.isArray(products)
      ? [...new Set(products.map((p) => p.category))]
      : [];
    setAvailableCategories(categories);
  }, [products]);

  const fetchProducts = async () => {
  setLoading(true);
  try {
    const res = await api.get("/api/products");
    console.log("API full response:", res.data);

    const mockdata = res.data;
    const productArray = Array.isArray(mockdata.data) ? mockdata.data : [];

    setTimeout(() => {
      setProducts(productArray);
      setLoading(false);
    }, 800);
  } catch (error) {
    console.error("Error fetching products:", error);
    showNotification("Error loading products", "error");
    setLoading(false);
  }
};


  const filteredAndSortedProducts = () => {
    let result = Array.isArray(products) ? [...products] : [];

    result = result.filter(
      (product) =>
        (product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    if (filters.minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(filters.maxPrice)
      );
    }

    if (filters.sizes.length > 0) {
      result = result.filter(
        (product) =>
          product.sizes.length === 0 ||
          product.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      sizes: [],
      imageUrl: "",
    });
    setPreviewImage(null);
    setFormErrors({});
    setFormMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    });
    setCurrentProduct(product);
    setFormErrors({});
    setFormMode("edit");
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const toggleCategoryFilter = (category) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== category),
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category],
      });
    }
  };

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      minPrice: "",
      maxPrice: "",
      sizes: [],
    });
    setSearchQuery("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
    };

    try {
      if (formMode === "create") {
        const res = await api.post("/api/products", productData);

        if (res.status === 201 || res.status === 200) {
          const newProduct = res.data;
          setProducts([newProduct, ...products]);
          showNotification("Product created successfully", "success");
        } else {
          showNotification("Failed to create product", "error");
        }
      } else {
        const res = await axios.put(
          `/api/products/${currentProduct._id}`,
          productData
        );

        if (res.status === 200) {
          const updatedProduct = res.data;
          const updatedProducts = products.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          );

          setProducts(updatedProducts);
          showNotification("Product updated successfully", "success");
        } else {
          showNotification("Failed to update product", "error");
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Error saving product", "error");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const updatedProducts = products.filter((p) => p._id !== productId);
      setProducts(updatedProducts);
      showNotification("Product deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Error deleting product", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const filteredProductCount = filteredAndSortedProducts().length;
  const totalProductCount = Array.isArray(products) ? products.length : 0;

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Product Management Dashboard
          </h1>
          <button
            onClick={openCreateModal}
            className="flex items-center bg-white text-purple-800 px-4 py-2 rounded-md hover:bg-purple-100 transition duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add New Product
          </button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 max-w-md z-50">
          <div
            className={`p-4 rounded-md shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            } flex items-center`}
          >
            {notification.type === "success" ? (
              <div className="bg-green-200 p-2 rounded-full mr-3">✓</div>
            ) : (
              <div className="bg-red-200 p-2 rounded-full mr-3">✕</div>
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-3 w-full border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center px-4 py-2 border ${
                isFilterOpen
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "border-purple-300 text-purple-600 hover:bg-purple-50"
              } rounded-lg transition duration-200`}
            >
              <Filter size={18} className="mr-2" />
              Filters
              {(filters.categories.length > 0 ||
                filters.sizes.length > 0 ||
                filters.minPrice ||
                filters.maxPrice) && (
                <span className="ml-2 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {filters.categories.length +
                    filters.sizes.length +
                    (filters.minPrice ? 1 : 0) +
                    (filters.maxPrice ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-between w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50"
                onClick={() =>
                  document
                    .getElementById("sortDropdown")
                    .classList.toggle("hidden")
                }
              >
                <div className="flex items-center">
                  <ArrowUpDown size={18} className="mr-2" />
                  <span>
                    {sortBy === "newest"
                      ? "Newest First"
                      : sortBy === "oldest"
                      ? "Oldest First"
                      : sortBy === "priceAsc"
                      ? "Price: Low to High"
                      : sortBy === "priceDesc"
                      ? "Price: High to Low"
                      : sortBy === "nameAsc"
                      ? "Name: A to Z"
                      : sortBy === "nameDesc"
                      ? "Name: Z to A"
                      : "Sort"}
                  </span>
                </div>
                <ChevronDown size={16} />
              </button>
              <div
                id="sortDropdown"
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden"
              >
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "newest" ? "bg-purple-100 text-purple-800" : ""
                    }`}
                    onClick={() => {
                      setSortBy("newest");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Newest First
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "oldest" ? "bg-purple-100 text-purple-800" : ""
                    }`}
                    onClick={() => {
                      setSortBy("oldest");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Oldest First
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "priceAsc"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("priceAsc");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "priceDesc"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("priceDesc");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "nameAsc"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("nameAsc");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Name: A to Z
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-purple-50 ${
                      sortBy === "nameDesc"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }`}
                    onClick={() => {
                      setSortBy("nameDesc");
                      document
                        .getElementById("sortDropdown")
                        .classList.add("hidden");
                    }}
                  >
                    Name: Z to A
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Filter Options */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategoryFilter(category)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                    {availableCategories.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No categories available
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">
                    Price Range
                  </h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Min ($)</label>
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handlePriceFilterChange}
                        placeholder="0"
                        className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Max ($)</label>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handlePriceFilterChange}
                        placeholder="9999"
                        className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSizeFilter(size)}
                        className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                          filters.sizes.includes(size)
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-purple-300 text-purple-800 hover:bg-purple-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProductCount} out of {totalProductCount} products
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-purple-700">Loading products...</p>
            </div>
          ) : filteredAndSortedProducts().length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-500 mb-4">
                <Info size={40} />
              </div>
              <p className="text-gray-600 text-lg">
                {searchQuery ||
                filters.categories.length > 0 ||
                filters.sizes.length > 0 ||
                filters.minPrice ||
                filters.maxPrice
                  ? "No products match your search criteria"
                  : "No products found. Add your first product!"}
              </p>
              {(searchQuery ||
                filters.categories.length > 0 ||
                filters.sizes.length > 0 ||
                filters.minPrice ||
                filters.maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts().map((product) => (
                  <div
                    key={product._id}
                    className="border border-purple-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-purple-50 relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon size={48} className="text-purple-200" />
                        </div>
                      )}
                      {/* {product.sizes.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                          {product.sizes.slice(0, 3).join(", ")}
                          {product.sizes.length > 3 && "..."}
                        </div>
                      )} */}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-purple-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="text-lg font-semibold text-purple-700">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {product.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center pt-2 border-t border-purple-100 mt-auto">
                        <span className="text-xs text-gray-500">
                          Added on {formatDate(product.createdAt)}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-md transition-colors"
                            title="Edit product"
                          >
                            <PenLine size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-purple-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-purple-900">
                  {formMode === "create" ? "Add New Product" : "Edit Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        formErrors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                      {availableCategories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Sizes */}
                {/* <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Available Sizes (optional)
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsSizeMenuOpen(!isSizeMenuOpen)}
                        className="text-sm text-purple-600 hover:text-purple-800"
                    >
                        {isSizeMenuOpen ? "Close" : "Select Sizes"}
                    </button>
                    </div>

                    {isSizeMenuOpen && (
                    <div className="mb-3 p-3 border border-purple-100 rounded-md">
                        <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <button
                            type="button"
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                formData.sizes.includes(size)
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-purple-300 text-purple-800 hover:bg-purple-50"
                            }`}
                            >
                            {size}
                            </button>
                        ))}
                        </div>
                    </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                    {formData.sizes.length > 0 ? (
                        formData.sizes.map((size) => (
                        <span
                            key={size}
                            className="inline-flex items-center bg-purple-100 text-purple-800 text-xs rounded px-2 py-1"
                        >
                            {size}
                            <button
                            type="button"
                            onClick={() => toggleSize(size)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                            <X size={12} />
                            </button>
                        </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                        No sizes selected
                        </p>
                    )}
                    </div>
                </div> */}

                {/* Product Image */}
                {/* <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image (optional)
                    </label>

                    <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-24 w-24 bg-purple-50 rounded-md overflow-hidden border border-gray-200">
                        {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Product preview"
                            className="h-full w-full object-cover"
                        />
                        ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon size={32} className="text-purple-200" />
                        </div>
                        )}
                    </div>

                    <div className="flex-grow">
                        <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        />
                        <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                        <ImageIcon size={16} className="mr-2" />
                        {previewImage ? "Change Image" : "Upload Image"}
                        </label>

                        {previewImage && (
                        <button
                            type="button"
                            onClick={() => {
                            setPreviewImage(null);
                            setFormData({
                                ...formData,
                                imageUrl: "",
                            });
                            }}
                            className="ml-3 text-sm text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, or GIF up to 5MB
                        </p>
                    </div>
                    </div>
                </div> */}
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {formMode === "create" ? "Create Product" : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
