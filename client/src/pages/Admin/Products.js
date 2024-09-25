import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Get all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data?.message || "Failed to load products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Something went wrong while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return <div className="text-center">Loading products...</div>; // Loading feedback
  }

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => {
              const imageUrl = `${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`;
              return (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/path/to/default/image.jpg'; // Ensure this path is correct
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0, 60)}...</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
