import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SignInContractABI from '../component/abi/SigninContractAbi.json'; // Import the ABI

const ConnectMetamask = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [signInContract, setSignInContract] = useState(null); // Add state for the contract instance
  const [isSignedIn, setIsSignedIn] = useState(false); // Add state to track sign-in status

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum && window.ethereum.selectedAddress) {
          setIsConnected(true);
          setAccount(window.ethereum.selectedAddress);
          const web3 = new Web3(window.ethereum);
          const balance = await web3.eth.getBalance(window.ethereum.selectedAddress);
          setBalance(web3.utils.fromWei(balance, 'ether'));
          // Instantiate the contract
          const contract = new web3.eth.Contract(SignInContractABI, '0x4d49663F0A2bee383671F85854C106b538794CA1'); // Replace with your contract address
          setSignInContract(contract);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error checking Metamask connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(window.ethereum.selectedAddress);
        const web3 = new Web3(window.ethereum);
        const balance = await web3.eth.getBalance(window.ethereum.selectedAddress);
        setBalance(web3.utils.fromWei(balance, 'ether'));
        // Instantiate the contract
        const contract = new web3.eth.Contract(SignInContractABI, '0x4d49663F0A2bee383671F85854C106b538794CA1'); // Replace with your contract address
        setSignInContract(contract);
      } else {
        alert('Metamask not detected. Please install Metamask to use this feature.');
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      alert('Error connecting to Metamask. Please try again.');
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(false);
        setAccount('');
        setBalance('');
        setSignInContract(null); // Clear contract instance
        setIsSignedIn(false); // Reset sign-in status
      }
    } catch (error) {
      console.error('Error disconnecting Metamask:', error);
      alert('Error disconnecting Metamask. Please try again.');
    }
  };

  const signIn = async () => {
    try {
      if (signInContract) {
        await signInContract.methods.signIn().send({ from: account });
        alert('Successfully signed in!');
        setIsSignedIn(true); // Update sign-in status
      } else {
        alert('Contract not instantiated. Please connect Metamask first.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      if (signInContract) {
        await signInContract.methods.signOut().send({ from: account });
        alert('Successfully signed out!');
        setIsSignedIn(false); // Update sign-in status
      } else {
        alert('Contract not instantiated. Please connect Metamask first.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };

  const truncatedAccount = isConnected ? `${account.slice(0, 5)}...${account.slice(-3)}` : '';

  return (
    <div>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Metamask</button>
      ) : (
        <div>
          <p>{truncatedAccount}</p>
          <p>{balance}</p>
          {!isSignedIn ? (
            <button onClick={signIn}>Sign In</button>
          ) : (
            <button onClick={signOut}>Sign Out</button>
          )}
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default ConnectMetamask;
