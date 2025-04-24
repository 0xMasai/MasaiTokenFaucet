import { useEffect, useState } from 'react'
import logo from './assets/logo.png'
import { ethers } from 'ethers'
import './App.css'




// Get contract address from .env file
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS


// Minimal ABI (only the functions we need)
const contractABI = [
  "function claimTokens() external",
  "function faucetAmount() public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)"
]

function App() {
  // State variables
const [account, setAccount] = useState(null)
const [provider, setProvider] = useState(null)
const [contract, setContract] = useState(null)

  const [faucetAmount, setFaucetAmount] = useState("")
  const [balance, setBalance] = useState("")
  const [txStatus, setTxStatus] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Automatically connect wallet on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' }) // Prompt user to connect
          await connectWallet()
        } catch (err) {
          console.error("User rejected connection", err)
          setErrorMsg("Connection to MetaMask was rejected.")
        }
      } else {
        setErrorMsg("Please install MetaMask to use this dApp.")
      }
    }

    autoConnect()
  }, [])

  // Connect wallet + contract setup
  const connectWallet = async () => {
    try {
      console.log("🔍 Trying to connect...");
  
      const provider = new ethers.BrowserProvider(window.ethereum)
  
      const signer = await provider.getSigner()
  
      const address = await signer.getAddress()
  
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
  
  
      const faucetAmt = await contract.faucetAmount()
  
      const balance = await contract.balanceOf(address)
  
      setAccount(address)
      setProvider(provider)
      setContract(contract)
      setFaucetAmount(ethers.formatUnits(faucetAmt, 18))
      setBalance(ethers.formatUnits(balance, 18))
      setErrorMsg("") // clear any old error
  
    } catch (err) {
      console.error("❌ Error in connectWallet:", err)
      setErrorMsg("Failed to connect wallet. Try again.")
    }
  }
  

  // Handle Claim Button
  const handleClaim = async () => {
    if (!contract) return

    try {
      setTxStatus("Claiming...")
      const tx = await contract.claimTokens()
      await tx.wait()

      setTxStatus("Tokens claimed!")

      const updatedBalance = await contract.balanceOf(account)
      setBalance(ethers.formatUnits(updatedBalance, 18))
    } catch (err) {
      console.error(err)
      setTxStatus("Claim failed")
    }
  }

  // JSX UI
  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Masai Logo" className="logo-image" />
        </div>
    
        <h1 className="app-title">Masai Token Faucet</h1>
    
        {errorMsg && <div className="error-message">{errorMsg}</div>}
    
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <div className="wallet-card">
              <h2>Connected Wallet</h2>
              <p><strong>{account}</strong></p>
            </div>
            <div className="faucet-info">
              <p><strong>Faucet Amount: </strong>{faucetAmount} MASAI</p>
              <p><strong>Your Balance: </strong>{balance} MASAI</p>
            </div>
            <button className="claim-btn" onClick={handleClaim}>Claim Tokens</button>
            <p className="tx-status">{txStatus}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
