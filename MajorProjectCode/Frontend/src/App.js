import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    if (account) {
      fetchProducts();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account]);

  async function connectToMetamask(userRole) {
    if (window.ethereum) {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setRole(userRole);
        localStorage.setItem('account', address);
        localStorage.setItem('role', userRole);
        console.log(`Logged in as ${userRole}: ${address}`);
        await fetchProducts();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    } else {
      alert("Metamask is not detected in the browser");
    }
  }

  async function fetchProducts() {
    if (!provider) return;
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const data = await contract.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      logout();
    } else {
      setAccount(accounts[0]);
      localStorage.setItem('account', accounts[0]);
    }
  }

  function logout() {
    setAccount(null);
    setRole(null);
    localStorage.removeItem('account');
    localStorage.removeItem('role');
  }

  return (
    <div className="App">
      {loading ? (
        <p>Connecting to Metamask...</p>
      ) : account ? (
        <Dashboard account={account} role={role} products={products} logout={logout} />
      ) : (
        <Login connectToMetamask={connectToMetamask} />
      )}
    </div>
  );
}

export default App;
