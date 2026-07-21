import React, { useEffect, useState } from "react";
import { Plus, Edit, Save, X, Image, Package, Tag, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app") + "/api/niches";
// const API_URL = "http://localhost:3000/api/niches";

// Product Image Carousel Component
function ProductImageCarousel({ images, productName }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 group">
      <div className="relative h-32 overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${productName} - Image ${index + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            onError={(e) => {
              console.error(`Failed to load product image: ${img}`);
              e.target.src = "https://via.placeholder.com/150?text=Image+Failed";
            }}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [niches, setNiches] = useState([]);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [newNiche, setNewNiche] = useState({ name: "", themeFileUrl: "" });
  const [newProducts, setNewProducts] = useState({});
  const [newBanners, setNewBanners] = useState({});
  const [newMultiRowImages, setNewMultiRowImages] = useState({});
  const [editingNiche, setEditingNiche] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setNiches(data);

      // Update selected niche if it exists
      if (selectedNiche) {
        const updatedNiche = data.find(n => n._id === selectedNiche._id);
        if (updatedNiche) {
          setSelectedNiche(updatedNiche);
        }
      }
    } catch (error) {
      console.error("Failed to fetch niches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiches();
  }, []);

  const saveNiche = async (id = null) => {
    if (!newNiche.name) return;
    try {
      await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNiche),
      });
      setNewNiche({ name: "", themeFileUrl: "" });
      setEditingNiche(null);
      fetchNiches();
    } catch (error) {
      console.error("Failed to save niche:", error);
    }
  };

  const addProduct = async (nicheId, product) => {
    if (!product.name || !product.price) return;
    try {
      // Filter out empty image URLs before sending
      const productToSend = {
        ...product,
        imageUrls: product.imageUrls ? product.imageUrls.filter(url => url && url.trim() !== "") : [],
      };

      await fetch(`${API_URL}/${nicheId}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSend),
      });
      setNewProducts(prev => ({ ...prev, [nicheId]: {} }));
      fetchNiches();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const deleteProduct = async (nicheId, productId) => {
    try {
      await fetch(`${API_URL}/${nicheId}/product/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      fetchNiches();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const addBanner = async (nicheId, url) => {
    if (!url) return;
    try {
      await fetch(`${API_URL}/${nicheId}/banner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      setNewBanners(prev => ({ ...prev, [nicheId]: "" }));
      fetchNiches();
    } catch (error) {
      console.error("Failed to add banner:", error);
    }
  };

  const deleteBanner = async (nicheId, bannerIndex) => {
    try {
      await fetch(`${API_URL}/${nicheId}/banner/${bannerIndex}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      fetchNiches();
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const addMultiRowImage = async (nicheId, url) => {
    if (!url) return;
    try {
      await fetch(`${API_URL}/${nicheId}/multirow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      setNewMultiRowImages(prev => ({ ...prev, [nicheId]: "" }));
      fetchNiches();
    } catch (error) {
      console.error("Failed to add multi-row image:", error);
    }
  };

  const deleteMultiRowImage = async (nicheId, multiRowIndex) => {
    try {
      await fetch(`${API_URL}/${nicheId}/multirow/${multiRowIndex}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      fetchNiches();
    } catch (error) {
      console.error("Failed to delete multi-row image:", error);
    }
  };

  const handleProductChange = (nicheId, field, value) => {
    setNewProducts((prev) => ({
      ...prev,
      [nicheId]: { ...prev[nicheId], [field]: value },
    }));
  };

  const addImageField = (nicheId) => {
    setNewProducts((prev) => {
      const currentProduct = prev[nicheId] || {};
      const currentImageUrls = currentProduct.imageUrls || [];
      return {
        ...prev,
        [nicheId]: {
          ...currentProduct,
          imageUrls: [...currentImageUrls, ""],
        },
      };
    });
  };

  const removeImageField = (nicheId, index) => {
    setNewProducts((prev) => {
      const currentProduct = prev[nicheId] || {};
      const currentImageUrls = currentProduct.imageUrls || [];
      const updatedImageUrls = currentImageUrls.filter((_, i) => i !== index);
      return {
        ...prev,
        [nicheId]: {
          ...currentProduct,
          imageUrls: updatedImageUrls.length > 0 ? updatedImageUrls : [],
        },
      };
    });
  };

  const updateImageUrl = (nicheId, index, value) => {
    setNewProducts((prev) => {
      const currentProduct = prev[nicheId] || {};
      const currentImageUrls = currentProduct.imageUrls || [""];
      const updatedImageUrls = [...currentImageUrls];
      updatedImageUrls[index] = value;
      return {
        ...prev,
        [nicheId]: {
          ...currentProduct,
          imageUrls: updatedImageUrls,
        },
      };
    });
  };

  const handleBannerChange = (nicheId, value) => {
    setNewBanners((prev) => ({ ...prev, [nicheId]: value }));
  };

  const handleMultiRowImageChange = (nicheId, value) => {
    setNewMultiRowImages((prev) => ({ ...prev, [nicheId]: value }));
  };

  const startEditing = (niche) => {
    setEditingNiche(niche._id);
    setNewNiche({ name: niche.name, themeFileUrl: niche.themeFileUrl || "" });
  };

  const cancelEditing = () => {
    setEditingNiche(null);
    setNewNiche({ name: "", themeFileUrl: "" });
  };

  const handleNicheSelect = (niche) => {
    setSelectedNiche(niche);
  };

  const handleBackToList = () => {
    setSelectedNiche(null);
    setEditingNiche(null);
    setNewNiche({ name: "", themeFileUrl: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If a niche is selected, show the detailed view
  if (selectedNiche) {
    const niche = selectedNiche;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Niches
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {niche.name}
                </h1>
                <p className="text-gray-600 font-medium">Manage products, banners, and multi-row images</p>
              </div>
            </div>
          </div>

          {/* Niche Details Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden mb-8">
            {/* Niche Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    {editingNiche === niche._id ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={newNiche.name}
                          onChange={(e) => setNewNiche({ ...newNiche, name: e.target.value })}
                          className="text-lg font-semibold bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <input
                          type="text"
                          value={newNiche.themeFileUrl}
                          onChange={(e) => setNewNiche({ ...newNiche, themeFileUrl: e.target.value })}
                          placeholder="Theme URL"
                          className="text-sm bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-1">{niche.name}</h2>
                        <p className="text-sm text-white/90">
                          Theme: {niche.themeFileUrl || "Not specified"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingNiche === niche._id ? (
                    <>
                      <button
                        onClick={() => saveNiche(niche._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(niche)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-all shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Products Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Products</h3>
                  <span className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-3 py-1 rounded-full shadow-md">
                    {niche.products?.length || 0}
                  </span>
                </div>

                {niche.products && niche.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {niche.products.map((product, i) => (
                      <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 relative shadow-md hover:shadow-xl transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                              ${product.price}
                            </span>
                            <button
                              onClick={() => deleteProduct(niche._id, product._id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        {(product.imageUrls && product.imageUrls.length > 0) || product.imageUrl ? (
                          <ProductImageCarousel
                            images={product.imageUrls || (product.imageUrl ? [product.imageUrl] : [])}
                            productName={product.name}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-5 border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No products added yet</p>
                  </div>
                )}

                {/* Add Product Form */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Product
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Product name"
                      onChange={(e) => handleProductChange(niche._id, "name", e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      onChange={(e) => handleProductChange(niche._id, "price", e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Discounted Price"
                      onChange={(e) => handleProductChange(niche._id, "discountedPrice", e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      onChange={(e) => handleProductChange(niche._id, "description", e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                    />
                    <div className="md:col-span-2 lg:col-span-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Product Images
                      </label>
                      <div className="space-y-3">
                        {(() => {
                          const imageUrls = newProducts[niche._id]?.imageUrls;
                          const urls = (imageUrls && imageUrls.length > 0) ? imageUrls : [""];

                          return urls.map((url, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  placeholder={`Image URL ${index + 1}`}
                                  value={url || ""}
                                  onChange={(e) => updateImageUrl(niche._id, index, e.target.value)}
                                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                                />
                                {url && url.trim() !== "" && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <img
                                      src={url}
                                      alt={`Preview ${index + 1}`}
                                      className="w-8 h-8 rounded object-cover border-2 border-gray-200 shadow-sm"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              {index === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => addImageField(niche._id)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Image
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeImageField(niche._id, index)}
                                  className="inline-flex items-center justify-center w-11 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
                                  aria-label="Remove image"
                                  title="Remove image"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Add multiple images for your product. Click "Add Image" to add more.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addProduct(niche._id, newProducts[niche._id] || {})}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Banners Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Banner Images</h3>
                  <span className="text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-3 py-1 rounded-full shadow-md">
                    {niche.bannerImages?.length || 0}
                  </span>
                </div>

                {niche.bannerImages && niche.bannerImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-5">
                    {niche.bannerImages.map((img, i) => (
                      <div key={i} className="relative group overflow-hidden rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
                        <img
                          src={img}
                          alt={`Banner ${i + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error(`Failed to load banner image: ${img}`);
                            e.target.src = "https://via.placeholder.com/150?text=Image+Failed";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        <button
                          onClick={() => deleteBanner(niche._id, i)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-5 border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No banners added yet</p>
                  </div>
                )}

                {/* Add Banner Form */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Add New Banner
                  </h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Banner image URL"
                      value={newBanners[niche._id] || ""}
                      onChange={(e) => handleBannerChange(niche._id, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                    />
                    <button
                      onClick={() => addBanner(niche._id, newBanners[niche._id])}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
                    >
                      <Plus className="w-5 h-5" />
                      Add Banner
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Row Images Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Multi-Row Images</h3>
                  <span className="text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-3 py-1 rounded-full shadow-md">
                    {niche.multiRowImages?.length || 0}/3
                  </span>
                </div>

                {niche.multiRowImages && niche.multiRowImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {niche.multiRowImages.map((img, i) => (
                      <div key={i} className="relative group overflow-hidden rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                          MultiRow {i + 1}
                        </div>
                        <img
                          src={img}
                          alt={`MultiRow ${i + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error(`Failed to load multi-row image: ${img}`);
                            e.target.src = "https://via.placeholder.com/150?text=Image+Failed";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        <button
                          onClick={() => deleteMultiRowImage(niche._id, i)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-5 border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No multi-row images added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Maximum 3 images allowed</p>
                  </div>
                )}

                {/* Add Multi-Row Image Form */}
                {(!niche.multiRowImages || niche.multiRowImages.length < 3) && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200 shadow-md">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-purple-600" />
                      Add Multi-Row Image ({niche.multiRowImages?.length || 0}/3)
                    </h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Multi-row image URL"
                        value={newMultiRowImages[niche._id] || ""}
                        onChange={(e) => handleMultiRowImageChange(niche._id, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white shadow-sm hover:shadow-md transition-all"
                      />
                      <button
                        onClick={() => addMultiRowImage(niche._id, newMultiRowImages[niche._id])}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                      >
                        <Plus className="w-5 h-5" />
                        Add Image
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      These images will be uploaded to Shopify store as multirow1, multirow2, multirow3
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show niche cards list
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 font-medium">Select a niche to manage products, banners, and images</p>
            </div>
          </div>
        </div>

        {/* Add New Niche Card */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 mb-8 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add New Niche</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Niche Name
                </label>
                <input
                  type="text"
                  placeholder="Enter niche name"
                  value={newNiche.name}
                  onChange={(e) => setNewNiche({ ...newNiche, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Theme File URL
                </label>
                <input
                  type="text"
                  placeholder="Enter theme file URL"
                  value={newNiche.themeFileUrl}
                  onChange={(e) => setNewNiche({ ...newNiche, themeFileUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <button
              onClick={() => saveNiche()}
              disabled={!newNiche.name}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 disabled:shadow-none"
            >
              <Save className="w-5 h-5" />
              Create Niche
            </button>
          </div>
        </div> */}

        {/* Niches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche) => (
            <div
              key={niche._id}
              onClick={() => handleNicheSelect(niche)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              {/* Niche Card Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">{niche.name}</h2>
                    <p className="text-sm text-white/90 truncate">
                      {niche.themeFileUrl || "No theme specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Niche Card Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{niche.products?.length || 0}</p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Image className="w-5 h-5 text-pink-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{niche.bannerImages?.length || 0}</p>
                    <p className="text-xs text-gray-500">Banners</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Image className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{niche.multiRowImages?.length || 0}</p>
                    <p className="text-xs text-gray-500">MultiRow</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center group-hover:text-indigo-600 transition-colors">
                    Click to manage →
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {niches.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No niches found</h3>
            <p className="text-gray-600 font-medium">Create your first niche to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}