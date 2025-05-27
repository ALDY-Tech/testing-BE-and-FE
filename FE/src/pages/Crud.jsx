import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

const ResizableHead = ({ children, width, onMouseDown, isDragging }) => (
  <th
    className="relative border px-2 text-center text-xs md:text-sm lg:text-base bg-yellow"
    style={{ 
      width,
      minWidth: 50,
      transition: isDragging ? 'none' : 'width 0.2s ease'
    }}
  >
    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
      {children}
    </div>
    {onMouseDown && (
      <div
        onMouseDown={onMouseDown}
        className={`absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-blue-200 ${
          isDragging ? 'bg-blue-300' : ''
        }`}
        style={{ userSelect: 'none' }}
      />
    )}
  </th>
);

const Crud = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });
  const [colWidths, setColWidths] = useState({
    no: 60,
    date: 160,
    desc: 320,
    amount: 160,
    actions: 120,
  });
  const [isDraggingHeader, setIsDraggingHeader] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const navigate = useNavigate();

  const handleMouseDown = (key) => (e) => {
    setIsDraggingHeader(true);
    const startX = e.clientX;
    const startWidth = colWidths[key];
    
    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setColWidths((prev) => ({
        ...prev,
        [key]: Math.max(newWidth, 50),
      }));
    };

    const onMouseUp = () => {
      setIsDraggingHeader(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/transaction", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTransactions(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingTransaction 
        ? `http://localhost:5000/transaction/${editingTransaction.id}`
        : "http://localhost:5000/transaction";
      const method = editingTransaction ? 'put' : 'post';

      await axios[method](url, 
        {
          description: formData.description,
          amount: parseFloat(formData.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFormData({ description: "", amount: "" });
      setShowModal(false);
      setEditingTransaction(null);
      await fetchTransactions();
    } catch (err) {
      console.error("Submission error:", err);
      alert(editingTransaction ? "Gagal mengupdate transaksi" : "Gagal menambahkan transaksi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus transaksi");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: parseFloat(transaction.amount),
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white text-xs md:text-sm lg:text-base">
      <Navbar />
      <div className="font-montserrat text-blue p-4 md:p-6">
        <button 
          className="py-2 px-4 bg-red-600 rounded-lg text-yellow hover:bg-red-600/90 mb-4"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold">Transaction</h1>
          <button
            onClick={() => {
              setFormData({ description: "", amount: "" });
              setEditingTransaction(null);
              setShowModal(true);
            }}
            className="bg-blue px-4 py-2 rounded-md text-yellow hover:bg-blue/90 transition-colors"
          >
            Add New Transaction
          </button>
        </div>

        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto h-96">
            <Table className="bg-white min-w-full">
              <TableHeader className="sticky top-0 bg-yellow z-10">
                <TableRow>
                  <ResizableHead width={colWidths.no} onMouseDown={handleMouseDown("no")}>
                    No
                  </ResizableHead>
                  <ResizableHead width={colWidths.date} onMouseDown={handleMouseDown("date")}>
                    Date
                  </ResizableHead>
                  <ResizableHead width={colWidths.desc} onMouseDown={handleMouseDown("desc")}>
                    Description
                  </ResizableHead>
                  <ResizableHead width={colWidths.amount} onMouseDown={handleMouseDown("amount")}>
                    Amount
                  </ResizableHead>
                  <ResizableHead width={colWidths.actions}>
                    Actions
                  </ResizableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-yellow/5">
                      <TableCell className="border text-center p-2 break-words" style={{width: colWidths.no}}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="border text-center p-2 break-words" style={{width: colWidths.date}}>
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="border text-center p-2 break-words" style={{width: colWidths.desc}}>
                        {item.description}
                      </TableCell>
                      <TableCell className="border text-center p-2 font-medium break-words" style={{width: colWidths.amount}}>
                        Rp {item.amount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell 
                        className="border text-center p-2 break-words" 
                        style={{width: colWidths.actions}}
                      >
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-2 py-1 bg-blue text-yellow rounded hover:bg-blue/90 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2 py-1 bg-red-600 text-yellow rounded hover:bg-red-600/90 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue/50 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue/50 outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTransaction(null);
                    }}
                    className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue text-white rounded hover:bg-blue/90"
                  >
                    {editingTransaction ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crud;
