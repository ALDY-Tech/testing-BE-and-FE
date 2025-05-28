import React, { useState, useEffect, useRef } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, MoreHorizontal } from 'lucide-react';
import Swal from "sweetalert2";
import { format, parseISO } from 'date-fns';

const columnHelper = createColumnHelper();

const Table = () => {
  const [transactions, setTransactions] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  // Set default tanggal hari ini untuk input date add modal
  const today = new Date().toISOString().slice(0, 10);
  const [newDate, setNewDate] = useState(today);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen !== null && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = (id) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setIsMenuOpen(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Confirm Add?',
      text: "Are you sure you want to add this transaction?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/transaction",
        {
          amount: parseInt(newAmount),
          description: newDescription,
          createdAt: format(parseISO(newDate), 'dd/MM/yyyy'),  // Kirim tanggal baru jika API support
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(format(parseISO(newDate), 'dd/MM/yyyy'))
      setNewAmount('');
      setNewDescription('');
      setNewDate(today);
      setShowAddModal(false);
      fetchTransactions();

      Swal.fire('Added!', 'Transaction has been added.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add transaction.', 'error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Confirm update?',
      text: "Are you sure you want to update this transaction?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/transaction/${editData.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditData(null);
      fetchTransactions();

      Swal.fire('Updated!', 'Transaction has been updated.', 'success');
    } catch (err) {
      console.error("Edit error:", err);
      Swal.fire('Error', 'Failed to update transaction.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      Swal.fire('Deleted!', 'Transaction has been deleted.', 'success');
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire('Error', 'Failed to delete transaction.', 'error');
    }
  };

  const columns = [
    {
      id: 'rowNumber',
      header: 'No',
      cell: info => info.row.index + 1,
    },
    columnHelper.accessor("createdAt", {
      cell: info => new Date(info.getValue()).toLocaleDateString('id-ID'),
      header: () => (
        <div className="flex items-center justify-center gap-1">
          <User size={16} /> Date
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      cell: info => info.getValue(),
      header: () => (
        <div className="flex items-center justify-center gap-1">
          <User size={16} /> Description
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("amount", {
      cell: info => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(info.getValue()),
      header: () => (
        <div className="flex items-center justify-center gap-1">
          <User size={16} /> Amount
        </div>
      ),
      enableSorting: true,
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="relative">
          <MoreHorizontal className="cursor-pointer" onClick={() => handleMenuToggle(row.id)} />
          {isMenuOpen === row.id && (
            <div
              ref={menuRef}
              className="fixed mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-yellow-100 rounded-md"
                onClick={() => handleEdit(row.original)}
              >
                Edit
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 rounded-md"
                onClick={() => handleDelete(row.original.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search transactions..."
            className="w-full sm:w-1/2 p-2 border rounded-md shadow-sm"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-blue">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-sm font-semibold text-center hover:bg-red-400 text-yellow tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' ▲',
                          desc: ' ▼'
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={columns.length} className="text-center py-4">Loading...</td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="text-center py-4">No transactions found.</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-100 cursor-pointer">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-2 text-center text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editData.amount}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Table;
