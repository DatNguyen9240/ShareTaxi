import React, { useState, useEffect } from "react";
import axios from '../../config/axios';
import './wallet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash'; // Thêm lodash để sử dụng debounce
import CircularProgress from "@mui/material/CircularProgress";

export default function Wallet() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(10000); // Initialize amount with 10k VND
    const [message, setMessage] = useState({ success: '', error: '' });
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!userId) {
                setMessage({ error: 'You need to log in to view your balance.', success: '' });
                return;
            }

            try {
                const response = await axios.get(`Wallet/balance/${userId}`);
                
                if (response.data && response.data.balance !== undefined) {
                    setBalance(response.data.balance);
                } else {
                    setMessage({ error: 'Invalid response structure.', success: '' });
                }
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
                setBalance(0);
            }
        };

        fetchBalance();
    }, [userId]); // Fetch balance whenever userId changes

    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }, 1000);
    }, []);

    const createPaymentLink = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/create-payment-link', {
                userId,
                amount: parseInt(amount, 10),
                description: `Add funds to wallet ${userId}`,
            });

            if (response.data && response.data.paymentLink) {
                window.location.href = response.data.paymentLink; // Redirect to payment link
            } else {
                toast.error('Failed to get payment link.');
            }
        } catch (error) {
            console.error('Error creating payment link:', error);
            toast.error('Failed to create payment link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;

        // Kiểm tra xem giá trị nhập vào có phải là số
        if (isNaN(value)) {
            toast.error('Please select a valid amount.');
            return; // Ngừng thực hiện nếu có lỗi
        }

        setAmount(value);
        setMessage({ success: '', error: '' });
    };

    return (
        <div className="wallet-container">
            {pageLoading ? (
                <div className="loading-spinner">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <ToastContainer />
                    <h2 className="wallet-title">Your Wallet</h2>
                    <p className="wallet-balance">Current Balance: <span className="wallet-balance-amount">{(balance).toLocaleString()} VND</span></p>

                    <label className="wallet-input-label">
                        <strong>Amount to Add:</strong>
                    </label>
                    <select
                        onChange={handleAmountChange}
                        className="wallet-amount-input"
                    >
                        <option value="10000">10,000 VND</option>
                        <option value="20000">20,000 VND</option>
                        <option value="50000">50,000 VND</option>
                        <option value="100000">100,000 VND</option>
                        <option value="200000">200,000 VND</option>
                        <option value="500000">500,000 VND</option>
                    </select>

                    <button onClick={createPaymentLink} className="wallet-pay-button" disabled={loading || amount < 10000}>
                        {loading ? 'Loading...' : 'Proceed to Add Funds'}
                    </button>

                    {message.success && <p className="wallet-success-message">{message.success}</p>}
                    {message.error && <p className="wallet-error-message">{message.error}</p>}
                </>
            )}
        </div>
    );
}
