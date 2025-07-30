import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function Home() {
  const { cart, setCart, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const url = `${API_URL}/api/products/all?page=1&limit=8`;
      const result = await axios.get(url);
      setProducts(result.data.products || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item._id === product._id 
          ? { ...item, qty: item.qty + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    // Show success message (could use toast)
  };

  const buyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleLoginToBuy = () => {
    navigate("/login");
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-text)", marginBottom: "1rem" }}>
            Welcome to <span style={{ color: "var(--color-accent)" }}>MERN Store</span>
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </Button>
            <Button variant="secondary" onClick={() => navigate("/cart")}>View Cart ({cart.length})</Button>
          </div>
        </div>

        {/* Featured Products */}
        <div id="products" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "1.5rem" }}>Featured Products</h2>
          {isLoading && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
              <p style={{ color: "#666" }}>Loading products...</p>
            </div>
          )}
          {error && (
            <div style={{ color: "var(--color-error)", textAlign: "center", marginBottom: "1.5rem" }}>{error}</div>
          )}
          {!isLoading && !error && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>No Products Available</h3>
              <p style={{ color: "#666" }}>Check back later for new products!</p>
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {products.map((product) => (
                <Card key={product._id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img
                    src={product.imgUrl || "https://via.placeholder.com/160x120?text=No+Image"}
                    alt={product.productName}
                    style={{ width: "128px", height: "96px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid var(--color-border)" }}
                    onError={e => {
                      e.target.src = "https://via.placeholder.com/160x120?text=No+Image";
                    }}
                  />
                  <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h3 style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={product.productName}>
                      {product.productName}
                    </h3>
                    <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem", minHeight: "32px" }}>
                      {product.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ color: "var(--color-accent)", fontWeight: "bold" }}>${product.price}</span>
                      <span style={{ color: "#aaa", fontSize: "0.85rem" }}>
                        {cart.find(item => item._id === product._id)?.qty || 0} in cart
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <Button onClick={() => addToCart(product)} style={{ flex: 1, fontSize: "0.9rem", padding: "0.25rem 0.5rem" }}>
                        Add
                      </Button>
                      {user?.token ? (
                        <Button onClick={() => buyNow(product)} style={{ flex: 1, fontSize: "0.9rem", padding: "0.25rem 0.5rem" }}>
                          Buy
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={handleLoginToBuy} style={{ flex: 1, fontSize: "0.9rem", padding: "0.25rem 0.5rem" }}>
                          Login
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Button onClick={() => navigate("/admin/products")}>View All Products</Button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚚</div>
            <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Free Shipping</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Free shipping on all orders over $50</p>
          </Card>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
            <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Secure Payment</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>100% secure payment processing</p>
          </Card>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>↩️</div>
            <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Easy Returns</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>30-day return policy for all products</p>
          </Card>
        </div>

        {/* Call to Action */}
        <Card style={{ background: "var(--color-accent)", color: "#fff", textAlign: "center", padding: "2rem 1rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Ready to Shop?</h2>
          <p style={{ fontSize: "1rem", marginBottom: "1rem", opacity: 0.9 }}>
            Join thousands of satisfied customers who trust MERN Store for their shopping needs.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {!user?.token ? (
              <>
                <Button variant="secondary" onClick={() => navigate("/register")}>Create Account</Button>
                <Button style={{ background: "#fff", color: "var(--color-accent)" }} onClick={() => navigate("/login")}>Sign In</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => navigate("/cart")}>View Cart ({cart.length} items)</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}