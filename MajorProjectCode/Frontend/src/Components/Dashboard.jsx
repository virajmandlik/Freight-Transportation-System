import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../Constant/constant";
import { Alert, QRCode, Progress, Badge, Tooltip, Modal } from "antd";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ account, role }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    title: "",
    message: ""
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    avgTemperature: "0°C",
    damagedProducts: 0,
    activeShipments: 0
  });
  const [chartData, setChartData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    temperature: "",
    damageStatus: "",
    shipperLocation: "",
    productURL: "",
  });
  const [updateForm, setUpdateForm] = useState({
    temperature: "",
    damageStatus: "",
    location: "",
    productURL: "",
    receiverAddress: "",
    deliveryDetails: "",
  });

  useEffect(() => {
    fetchProducts();
    loadGoogleMaps();
  }, [account]);
  
  useEffect(() => {
    if (products.length > 0) {
      calculateStats();
      prepareChartData();
    }
  }, [products]);

  useEffect(() => {
    if (selectedProduct) {
      setUpdateForm({
        temperature: selectedProduct.temperature,
        damageStatus: selectedProduct.damageStatus,
        location: role === "Shipper" ? "" : selectedProduct.shipperLocation,
        productURL: selectedProduct.productURL || "",
        receiverAddress: "",
        deliveryDetails: selectedProduct.deliveryDetails || "",
      });
    }
  }, [selectedProduct, role]);

  async function fetchProducts() {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      const productCount = await contract.productCount();
      const data = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await contract.getProduct(i);
        data.push({
          id: product.id.toString(),
          name: product.name,
          temperature: product.temperature,
          damageStatus: product.damageStatus,
          status: product.status,
          shipperLocation: product.shipperLocation,
          productURL: product.productURL,
          deliveryDetails: product.deliveryDetails,
          lastUpdated: new Date().toISOString(),
        });
      }
      
      // Add dummy data if no products exist
      if (data.length === 0) {
        const dummyData = [
          {
            id: "1",
            name: "Organic Apples",
            temperature: "4.2°C",
            damageStatus: "None",
            status: "Shipped",
            shipperLocation: "28.6139, 77.209",
            productURL: "https://example.com/product/1",
            deliveryDetails: "Expected delivery on Monday",
            lastUpdated: "2023-06-15T09:24:00Z",
          },
          {
            id: "2",
            name: "Electronics Package",
            temperature: "22.5°C",
            damageStatus: "Minor",
            status: "In Transit",
            shipperLocation: "28.6219, 77.219",
            productURL: "https://example.com/product/2",
            deliveryDetails: "Handle with care, fragile items",
            lastUpdated: "2023-06-16T14:30:00Z",
          },
          {
            id: "3",
            name: "Medical Supplies",
            temperature: "2.1°C",
            damageStatus: "None",
            status: "Delivered",
            shipperLocation: "28.6339, 77.229",
            productURL: "https://example.com/product/3",
            deliveryDetails: "Refrigerated delivery completed",
            lastUpdated: "2023-06-14T11:45:00Z",
          },
        ];
        setProducts(dummyData);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      // Set dummy data in case of error
      const dummyData = [
        {
          id: "1",
          name: "Organic Apples",
          temperature: "4.2°C",
          damageStatus: "None",
          status: "Shipped",
          shipperLocation: "28.6139, 77.209",
          productURL: "https://example.com/product/1",
          deliveryDetails: "Expected delivery on Monday",
          lastUpdated: "2023-06-15T09:24:00Z",
        },
        {
          id: "2",
          name: "Electronics Package",
          temperature: "22.5°C",
          damageStatus: "Minor",
          status: "In Transit",
          shipperLocation: "28.6219, 77.219",
          productURL: "https://example.com/product/2",
          deliveryDetails: "Handle with care, fragile items",
          lastUpdated: "2023-06-16T14:30:00Z",
        },
        {
          id: "3",
          name: "Medical Supplies",
          temperature: "2.1°C",
          damageStatus: "None",
          status: "Delivered",
          shipperLocation: "28.6339, 77.229",
          productURL: "https://example.com/product/3",
          deliveryDetails: "Refrigerated delivery completed",
          lastUpdated: "2023-06-14T11:45:00Z",
        },
      ];
      setProducts(dummyData);
    }
  }
  
  function calculateStats() {
    const totalProducts = products.length;
    
    // Calculate average temperature
    let totalTemp = 0;
    let tempCount = 0;
    products.forEach(product => {
      const temp = parseFloat(product.temperature);
      if (!isNaN(temp)) {
        totalTemp += temp;
        tempCount++;
      }
    });
    const avgTemperature = tempCount > 0 ? (totalTemp / tempCount).toFixed(1) + '°C' : '0°C';
    
    // Count damaged products
    const damagedProducts = products.filter(
      product => product.damageStatus.toLowerCase() !== 'none'
    ).length;
    
    // Count active shipments
    const activeShipments = products.filter(
      product => product.status.toLowerCase() !== 'delivered'
    ).length;
    
    setStats({
      totalProducts,
      avgTemperature,
      damagedProducts,
      activeShipments
    });
  }
  
  function prepareChartData() {
    // Prepare data for status chart
    const statusCounts = {};
    products.forEach(product => {
      const status = product.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const chartData = Object.keys(statusCounts).map(status => ({
      name: status,
      count: statusCounts[status]
    }));
    
    setChartData(chartData);
  }

  async function addProduct() {
    if (!window.ethereum || role !== "Producer") return;
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      const tx = await contract.addProduct(
        form.name,
        form.temperature,
        form.damageStatus,
        account,
        account,
        form.shipperLocation,
        form.productURL
      );
      await tx.wait();
      setSuccess(true);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error: " + err.message);
    }
    setLoading(false);
  }

  async function updateProductStatus() {
    if (!window.ethereum || !selectedProduct) return;
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      let tx;
      const productId = selectedProduct.id;

      // Improved gas configuration to prevent transaction reverts
      const gasLimit = 800000; // Increased gas limit further
      const options = {
        gasLimit: gasLimit,
        gasPrice: ethers.utils.parseUnits('50', 'gwei') // Set a specific gas price
      };

      // Ensure all string parameters are properly formatted
      const temperature = updateForm.temperature.trim();
      const damageStatus = updateForm.damageStatus.trim();
      const location = updateForm.location ? updateForm.location.trim() : '';
      const productURL = updateForm.productURL ? updateForm.productURL.trim() : '';
      const deliveryDetails = updateForm.deliveryDetails ? updateForm.deliveryDetails.trim() : '';

      console.log(`Updating product ${productId} with role ${role}`);
      console.log(`Parameters: temp=${temperature}, damage=${damageStatus}, location=${location}`);

      switch (role) {
        case "Producer":
          tx = await contract.updateProducerDetails(
            productId,
            temperature,
            damageStatus,
            location,
            options
          );
          break;
        case "Shipper":
          tx = await contract.updateShipperDetails(
            productId,
            temperature,
            damageStatus,
            location,
            productURL,
            options
          );
          break;
        case "Receiver":
          tx = await contract.updateReceiverDetails(
            productId,
            temperature,
            damageStatus,
            deliveryDetails,
            options
          );
          break;
        default:
          throw new Error("Invalid role");
      }

      console.log("Transaction sent, waiting for confirmation...");
      await tx.wait();
      console.log("Transaction confirmed!");
      alert("Transaction successful!");
      fetchProducts();
      setSelectedProduct(null);
    } catch (err) {
      console.error("Transaction failed:", err);
      
      // Improved error handling for MetaMask transaction errors
      let errorTitle = "Transaction Failed";
      let errorMessage = "";
      
      if (err.code === -32603 && err.data) {
        // Handle internal JSON-RPC error
        errorMessage = "Transaction reverted. This could be due to one of the following reasons:\n";
        errorMessage += "- Insufficient gas\n";
        errorMessage += "- Contract conditions not met\n";
        errorMessage += "- Permission issues\n";
        errorMessage += "\nTechnical details: " + (err.data.message || err.message);
      } else if (err.code === 4001) {
        // User rejected the transaction
        errorMessage = "Transaction was rejected by the user.";
      } else if (err.message && err.message.includes("CALL_EXCEPTION")) {
        // Specific handling for CALL_EXCEPTION errors
        errorTitle = "Smart Contract Execution Failed";
        errorMessage = "This could be because:\n";
        errorMessage += "- You don't have permission to update this product\n";
        errorMessage += "- The product ID is invalid\n";
        errorMessage += "- The contract function has specific requirements that weren't met\n";
        errorMessage += "\nPlease verify your inputs and try again.";
      } else {
        // Other errors
        errorMessage = err.message;
      }
      
      // Show error in modal instead of alert
      setErrorModalContent({
        title: errorTitle,
        message: errorMessage
      });
      setErrorModalVisible(true);
    }
    setLoading(false);
  }

  function loadGoogleMaps() {
    // Check if Google Maps is already loading or loaded
    if (window.google || document.querySelector('script[src*="maps.googleapis.com"]')) {
      if (window.google && window.google.maps) {
        initMap();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwtexJ__L-FLh8THSr7SJbd2KFvGN3_yw&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    window.initMap = initMap;
    document.body.appendChild(script);
  }

  function initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    try {
      // Check if Google Maps API is properly loaded
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API not loaded properly");
        // Display a warning message about billing not enabled
        const warningDiv = document.createElement('div');
        warningDiv.className = 'map-error-message';
        warningDiv.innerHTML = `
          <strong>Google Maps could not be loaded</strong>
          <p>This may be due to billing not being enabled on the Google Maps API key.</p>
          <p>Please check the console for more details.</p>
        `;
        mapElement.appendChild(warningDiv);
        return;
      }

      const map = new window.google.maps.Map(mapElement, {
        center: { lat: 28.6139, lng: 77.209 },
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
      });

      // Only add click listener if we're in a role that needs to set location
      if (role === "Producer" || role === "Shipper") {
        map.addListener("click", (event) => {
          if (event && event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            if (role === "Producer") {
              setForm((prev) => ({
                ...prev,
                shipperLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              }));
            } else if (role === "Shipper" && selectedProduct) {
              setUpdateForm((prev) => ({
                ...prev,
                location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              }));
            }

            // Add a marker at clicked location
            new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: "Selected Location",
            });
          }
        });
      }

      // Display existing product locations if available
      if (products && products.length > 0) {
        products.forEach(product => {
          if (product.shipperLocation) {
            try {
              const [lat, lng] = product.shipperLocation.split(',').map(coord => parseFloat(coord.trim()));
              if (!isNaN(lat) && !isNaN(lng)) {
                new window.google.maps.Marker({
                  position: { lat, lng },
                  map,
                  title: `Product: ${product.name}`,
                  icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }
                });
              }
            } catch (e) {
              console.error("Error parsing location:", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Google Maps initialization error:", error);
      // Display error message in the map container
      mapElement.innerHTML = `
        <div class="map-error-message">
          <strong>Error loading Google Maps</strong>
          <p>There was a problem initializing the map.</p>
          <p>Error: ${error.message || 'Unknown error'}</p>
        </div>
      `;
    }
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard - {role}</h2>
      <p className="account-info">
        <strong>Account:</strong> {account}
      </p>

      {success && (
        <Alert
          message="Product added successfully!"
          type="success"
          showIcon
          closable
        />
      )}
      
      <div className="dashboard-stats">
        <div className="stat-card products">
          <div className="stat-card-title">Total Products</div>
          <div className="stat-card-value">{stats.totalProducts}</div>
          <div className="stat-card-info">All registered products</div>
        </div>
        
        <div className="stat-card temperature">
          <div className="stat-card-title">Average Temperature</div>
          <div className="stat-card-value">{stats.avgTemperature}</div>
          <div className="stat-card-info">Across all shipments</div>
        </div>
        
        <div className="stat-card damage">
          <div className="stat-card-title">Damaged Products</div>
          <div className="stat-card-value">{stats.damagedProducts}</div>
          <div className="stat-card-info">
            {stats.totalProducts > 0 
              ? ((stats.damagedProducts / stats.totalProducts) * 100).toFixed(1) + '% of total' 
              : '0% of total'}
          </div>
        </div>
        
        <div className="stat-card location">
          <div className="stat-card-title">Active Shipments</div>
          <div className="stat-card-value">{stats.activeShipments}</div>
          <div className="stat-card-info">Currently in transit</div>
        </div>
      </div>
      
      <div style={{ height: '300px', marginBottom: '2rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Shipment Status Overview</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="count" fill="#3498db" name="Products" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {role === "Producer" && (
        <div className="product-form">
          <input
            placeholder="Product Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Temperature"
            onChange={(e) => setForm({ ...form, temperature: e.target.value })}
          />
          <input
            placeholder="Damage Status"
            onChange={(e) => setForm({ ...form, damageStatus: e.target.value })}
          />
          <input
            placeholder="Shipper Location"
            value={form.shipperLocation}
            readOnly
          />
          <input
            placeholder="Product URL"
            onChange={(e) => setForm({ ...form, productURL: e.target.value })}
          />
          <button onClick={addProduct} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      )}

      {selectedProduct && (
        <div className="update-form">
          <h3>Update Product #{selectedProduct.id}</h3>
          <div className="form-grid">
            <input
              placeholder="Temperature"
              value={updateForm.temperature}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, temperature: e.target.value })
              }
            />
            <input
              placeholder="Damage Status"
              value={updateForm.damageStatus}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, damageStatus: e.target.value })
              }
            />

            {role === "Shipper" && (
              <>
                <input
                  placeholder="New Location"
                  value={updateForm.location}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, location: e.target.value })
                  }
                />
                <input
                  placeholder="Product URL"
                  value={updateForm.productURL}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, productURL: e.target.value })
                  }
                />
              </>
            )}

            {role === "Producer" && (
              <input
                placeholder="Shipper Location"
                value={updateForm.location}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, location: e.target.value })
                }
              />
            )}

            {role === "Receiver" && (
              <textarea
                placeholder="Delivery Details"
                value={updateForm.deliveryDetails}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    deliveryDetails: e.target.value,
                  })
                }
                className="delivery-textarea"
              />
            )}
          </div>
          <div className="form-actions">
            <button onClick={updateProductStatus} disabled={loading}>
              {loading ? "Updating..." : "Confirm Update"}
            </button>
            <button onClick={() => setSelectedProduct(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div
        id="map"
        style={{
          width: "100%",
          height: "400px",
          margin: "20px 0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className="map-container"
      ></div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Temperature</th>
            <th>Damage</th>
            <th>Status</th>
            <th>Location</th>
            <th>Delivery Details</th>
            <th>QR Code</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                <Tooltip title={`Temperature: ${product.temperature}`}>
                  <div>
                    {product.temperature}
                    <Progress 
                      percent={Math.min(parseFloat(product.temperature) * 3, 100)} 
                      size="small" 
                      status={parseFloat(product.temperature) > 25 ? "exception" : "active"} 
                      showInfo={false} 
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                </Tooltip>
              </td>
              <td>
                <Badge 
                  status={product.damageStatus.toLowerCase() === 'none' ? 'success' : 
                         product.damageStatus.toLowerCase() === 'minor' ? 'warning' : 'error'} 
                  text={product.damageStatus} 
                />
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span 
                    className={`status-indicator status-${product.status.toLowerCase().replace(' ', '-')}`}
                  ></span>
                  {product.status}
                </div>
              </td>
              <td>{product.shipperLocation}</td>
              <td>{product.deliveryDetails || "N/A"}</td>
              <td>
                {product.productURL ? (
                  <QRCode value={product.productURL} size={80} />
                ) : (
                  "No QR"
                )}
              </td>
              <td>
                {product.lastUpdated ? new Date(product.lastUpdated).toLocaleString() : "N/A"}
              </td>
              <td>
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={loading}
                  className="update-btn"
                >
                  {loading ? "..." : "Update"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedProduct && (
        <div className="product-details">
          <h3>Product Timeline</h3>
          <div className="product-timeline">
            <div className="timeline-item">
              <div className="timeline-date">Initial Registration</div>
              <div className="timeline-title">Product Added to Blockchain</div>
              <div className="timeline-description">Initial temperature: {selectedProduct.temperature}</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Shipping Started</div>
              <div className="timeline-title">Product Shipped from Warehouse</div>
              <div className="timeline-description">Location: {selectedProduct.shipperLocation}</div>
            </div>
            {selectedProduct.status === "In Transit" && (
              <div className="timeline-item">
                <div className="timeline-date">In Transit</div>
                <div className="timeline-title">Product is Being Transported</div>
                <div className="timeline-description">Current status: {selectedProduct.damageStatus}</div>
              </div>
            )}
            {selectedProduct.status === "Delivered" && (
              <div className="timeline-item">
                <div className="timeline-date">Delivery Complete</div>
                <div className="timeline-title">Product Successfully Delivered</div>
                <div className="timeline-description">{selectedProduct.deliveryDetails}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="logout-btn"
      >
        Logout
      </button>

      {/* Error Modal */}
      <Modal
        title={errorModalContent.title}
        open={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        footer={[
          <button 
            key="ok" 
            onClick={() => setErrorModalVisible(false)}
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "0.8rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            OK
          </button>
        ]}
      >
        <div className="error-modal-content">
          <p style={{ whiteSpace: "pre-line" }}>{errorModalContent.message}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
