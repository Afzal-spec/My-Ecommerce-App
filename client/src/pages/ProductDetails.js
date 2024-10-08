import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart"; // Import useCart for cart functionality
import toast from "react-hot-toast"; // Import toast for notifications
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart(); // Use cart context
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const apiUrl = process.env.REACT_APP_API; // Base URL from .env

  // Initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      setError("Failed to fetch product details. Please try again.");
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Add to cart function
  const handleAddToCart = (product) => {
    if (!cart.some(item => item._id === product._id)) {
      setCart([...cart, product]);
      localStorage.setItem("cart", JSON.stringify([...cart, product]));
      toast.success("Item added to cart!"); // Show success message
    } else {
      toast.error("Item is already in the cart!"); // Show error message
    }
  };

  if (loading) return <div className="text-center">Loading...</div>; // Loading UI
  if (error) return <div className="text-center text-danger">{error}</div>; // Error UI
  if (!product) return <div className="text-center">Product not found.</div>; // Fallback for no product

  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${apiUrl}/api/v1/product/product-photo/${product._id}`} // Use base URL for image
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Details</h1>
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>Price: ${product.price?.toLocaleString("en-US")}</h6>
          <h6>Category: {product?.category?.name}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => handleAddToCart(product)} // Handle adding to cart
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${apiUrl}/api/v1/product/product-photo/${p?._id}`} // Use base URL for image
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text"> ${p.price?.toLocaleString("en-US")}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                <button
                  className="btn btn-secondary ms-1"
                  onClick={() => handleAddToCart(p)} // Handle adding to cart
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
