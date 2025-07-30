import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
    // Add bounce animation to the cart icon
    const cartIcon = document.querySelector('.nav-link[href="/cart"]');
    if (cartIcon) {
      cartIcon.classList.add('bounce');
      setTimeout(() => cartIcon.classList.remove('bounce'), 1000);
    }
  };

  const decrement = (id, qty) => {
    if (qty <= 1) {
      const updatedCart = cart.filter((product) => product._id !== id);
      setCart(updatedCart);
    } else {
      const updatedCart = cart.map((product) =>
        product._id === id ? { ...product, qty: qty - 1 } : product
      );
      setCart(updatedCart);
    }
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((product) => product._id !== id);
    setCart(updatedCart);
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setOrderMessage("Your cart is empty!");
      return;
    }

    setIsPlacingOrder(true);
    setOrderMessage("");

    try {
      const orderData = {
        items: cart,
        orderValue: orderValue,
        email: user.email,
        userId: user.id
      };

      const url = `${API_URL}/api/orders`;
      const result = await axios.post(url, orderData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      setOrderMessage("Order placed successfully! Redirecting to orders...");
      setCart([]); // Clear cart
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        Navigate("/order");
      }, 2000);
      
    } catch (err) {
      console.log(err);
      setOrderMessage("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-6">Your Cart</h2>
            <div className="card p-8">
              <div className="text-gray-500 mb-4">
                🛒 Your cart is empty
              </div>
              <Link to="/" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h2 className="mb-6">Your Cart</h2>
        
        {orderMessage && (
          <div className={`alert ${orderMessage.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
            {orderMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg">Cart Items ({cart.length})</h3>
              </div>
              <div className="card-body">
                {cart.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={product.imgUrl || "https://via.placeholder.com/80x80"} 
                        alt={product.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{product.productName}</h4>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <p className="text-primary font-semibold">${product.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => decrement(product._id, product.qty)}
                        className="btn btn-secondary btn-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">
                        {product.qty}
                      </span>
                      <button 
                        onClick={() => increment(product._id, product.qty)}
                        className="btn btn-secondary btn-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">${(product.price * product.qty).toFixed(2)}</p>
                      <button 
                        onClick={() => removeItem(product._id)}
                        className="btn btn-danger btn-sm mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg">Order Summary</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">${orderValue.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  {user?.token ? (
                    <button 
                      className="btn btn-success w-full"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || cart.length === 0}
                    >
                      {isPlacingOrder ? (
                        <>
                          <span className="spinner"></span>
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={() => Navigate("/login")}
                      className="btn btn-primary w-full"
                    >
                      Login to Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}