import React, { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [toastList, setToastList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");

      const transactionContract = getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString("en-US"),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );
      setTransactions(structuredTransactions.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 gwei
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading -> ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success -> ${transactionHash.hash}`);

      const numberOfTransactions =
        await transactionContract.getTransactionCount();
      setTransactionCount(numberOfTransactions.toNumber());

      // toast notification
      const toastSuccess = {
        type: "success",
        title: "Transaction Success",
        message: "Transaction was sent successfully!",
      };
      setToastList([...toastList, toastSuccess]);

      //reset Form
      setFormData({
        addressTo: "",
        amount: "",
        keyword: "",
        message: "",
      });
    } catch (error) {
      const toastError = {
        type: "error",
        title: "Transaction Failed",
        message: error.message || "Transaction failed. Please try again.",
      };
      setToastList([...toastList, toastError]);
      throw new Error("No Ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
        toastList,
        setToastList,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
