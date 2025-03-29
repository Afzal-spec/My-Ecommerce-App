import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const AdminOrders = () => {
  const [statusOptions] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const apiUrl = process.env.REACT_APP_API; // Base URL from .env

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${apiUrl}/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated");
      getOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((order, index) => (
            <div className="border shadow mb-3" key={order._id}>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      <Select
                        bordered={false}
                        onChange={(value) => handleChange(order._id, value)}
                        defaultValue={order.status}
                      >
                        {statusOptions.map((status, idx) => (
                          <Option key={idx} value={status}>
                            {status}
                          </Option>
                        ))}
                      </Select>
                    </td>
                    <td>{order.buyer?.name}</td>
                    <td>{moment(order.createAt).fromNow()}</td>
                    <td>{order.payment.success ? "Success" : "Failed"}</td>
                    <td>{order.products?.length}</td>
                  </tr>
                </tbody>
              </table>
              <div className="container">
                {order.products?.map((product) => (
                  <div className="row mb-2 p-3 card flex-row" key={product._id}>
                    <div className="col-md-4">
                      <img
                        src={`${apiUrl}/api/v1/product/product-photo/${product._id}`} // Updated src to use base URL
                        className="card-img-top"
                        alt={product.name}
                        width="100"
                        height="100"
                      />
                    </div>
                    <div className="col-md-8">
                      <p>{product.name}</p>
                      <p>{product.description.substring(0, 30)}...</p>
                      <p>Price: ${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
