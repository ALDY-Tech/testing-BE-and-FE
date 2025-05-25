import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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
    <div
      onMouseDown={onMouseDown}
      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize   ${
        isDragging ? '' : ''
      }`}
      style={{ userSelect: 'none' }}
    />
  </th>
);

const Crud = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });

  const [colWidths, setColWidths] = useState({
    no: 60,
    date: 160,
    desc: 320,
    amount: 160,
  });

  const [isDraggingHeader, setIsDraggingHeader] = useState(false);

  const handleMouseDown = (key) => (e) => {
    setIsDraggingHeader(true);
    const startX = e.clientX;
    const startWidth = colWidths[key];
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setColWidths((prev) => ({
        ...prev,
        [key]: Math.max(newWidth, 50),
      }));
    };

    const onMouseUp = () => {
      setIsDraggingHeader(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-white text-xs md:text-sm lg:text-base">
      <Navbar />
      <div className="font-montserrat text-blue p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">Transaction</h1>

        <div className="mb-5 flex text-yellow">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue px-4 py-2 rounded-md text-xs md:text-sm hover:bg-blue/90 transition-colors"
          >
            Add New Transaction
          </button>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative mx-4">
                <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        alert("Token tidak ditemukan. Silakan login ulang.");
                        return;
                      }

                      await axios.post(
                        "http://localhost:5000/transaction",
                        {
                          description: formData.description,
                          amount: parseFloat(formData.amount),
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      setFormData({ description: "", amount: "" });
                      setShowModal(false);
                      await fetchTransactions();
                    } catch (err) {
                      console.error(err);
                      alert("Gagal menambahkan transaksi.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue/50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue/50 outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue text-white rounded hover:bg-blue/90"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <p className="text-red-600">{error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full overflow-x-auto rounded-md border shadow-sm">
            <Table className="bg-white min-w-full">
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <ResizableHead
                    width={colWidths.no}
                    onMouseDown={handleMouseDown("no")}
                    isDragging={isDraggingHeader}
                  >
                    No
                  </ResizableHead>
                  <ResizableHead
                    width={colWidths.date}
                    onMouseDown={handleMouseDown("date")}
                    isDragging={isDraggingHeader}
                  >
                    Date
                  </ResizableHead>
                  <ResizableHead
                    width={colWidths.desc}
                    onMouseDown={handleMouseDown("desc")}
                    isDragging={isDraggingHeader}
                  >
                    Description
                  </ResizableHead>
                  <ResizableHead
                    width={colWidths.amount}
                    onMouseDown={handleMouseDown("amount")}
                    isDragging={isDraggingHeader}
                  >
                    Amount
                  </ResizableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-yellow/5 transition-colors"
                  >
                    <TableCell
                      className="border text-center p-2"
                      style={{ width: colWidths.no }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className="border text-center p-2"
                      style={{ width: colWidths.date }}
                    >
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell
                      className="border text-center p-2"
                      style={{ width: colWidths.desc }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell
                      className="border text-center p-2 font-medium"
                      style={{ width: colWidths.amount }}
                    >
                      Rp {item.amount.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="mt-3 text-sm text-gray-500 md:hidden">
          Scroll horizontally → to view all columns
        </p>
      </div>
    </div>
  );
};

export default Crud;