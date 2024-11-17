import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { Table, message } from "antd";
import { toast } from "react-toastify";
import "./transaction.css";
import CircularProgress from "@mui/material/CircularProgress";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchTransactionHistory();
  }, [page, pageSize]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`TransactionHistory/user/${userId}`, {
        params: { page, pageSize },
      });

      const transactionsData = response.data.transactions.$values || [];
      setTransactions(transactionsData);
      setTotal(response.data.totalItems);
    } catch (error) {
      setError(
        error.response?.data.message || "Unable to fetch transaction history."
      );
      message.error("Unable to fetch transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      align: "center",
      render: (amount) => `${amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'Unknown'}`,
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      width: 150,
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      align: "center",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Reference ID",
      dataIndex: "referenceId",
      key: "referenceId",
      width: 200,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <span
          style={{
            color: status === 1 ? "#52c41a" : "#faad14",
            fontWeight: 500,
          }}
        >
          {status === 1 ? "Completed" : "Pending"}
        </span>
      ),
    },

  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="transaction-container">
      {pageLoading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className="transaction-title">Transaction History</h1>
          <Table
            columns={columns}
            dataSource={transactions}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            rowKey="id"
            className="transaction-table"
            bordered
          />
        </>
      )}
    </div>
  );
};

export default Transaction;
