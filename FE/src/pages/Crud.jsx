import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, MoreHorizontal } from 'lucide-react';

const columnHelper = createColumnHelper();

const ActionDropdown = ({ transactionId, onEdit, onDelete, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(transactionId);
        }}
        className="p-2 rounded-md hover:bg-yellow-100 text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label="Actions menu"
        title="Actions"
      >
        <MoreHorizontal size={20} />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(transactionId);
              onToggle(null);
            }}
            className="block w-full px-4 py-2 text-left text-yellow-700 hover:bg-yellow-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transactionId);
              onToggle(null);
            }}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const Crud = () => {
  const [transactions, setTransactions] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = useCallback((id) => {
    navigate(`/edit-transaction/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/transaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTransactions();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete transaction");
      }
    }
  }, [fetchTransactions]);

  const toggleDropdown = useCallback((id) => {
    setDropdownOpenId(prevId => prevId === id ? null : id);
  }, []);

  const columns = [
    {
      id: 'rowNumber',
      header: 'No',
      cell: info => info.row.index + 1,
    },
    columnHelper.accessor("createdAt", {
      cell: info => {
        const rawDate = new Date(info.getValue());
        return rawDate.toLocaleDateString('id-ID');
      },
      header: () => (
        <span className='flex items-center justify-center gap-1 text-blue-600 font-semibold'>
          <User size={16} /> Date
        </span>
      ),
    }),
    columnHelper.accessor("description", {
      cell: info => info.getValue(),
      header: () => (
        <span className='flex items-center justify-center gap-1 text-yellow-600 font-semibold'>
          <User size={16} /> Description
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("amount", {
      cell: info => {
        const amount = info.getValue();
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(amount);
      },
      header: () => (
        <span className='flex items-center justify-center gap-1 text-blue-600 font-semibold'>
          <User size={16} /> Amount
        </span>
      ),
      enableSorting: true,
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const transactionId = info.row.original._id;
        return (
          <ActionDropdown
            transactionId={transactionId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOpen={dropdownOpenId === transactionId}
            onToggle={toggleDropdown}
          />
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
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
    <div className='flex flex-col min-h-screen max-w-5xl mx-auto py-12 px-6 sm:px-8 lg:px-12'>
      <Navbar />

      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search transactions..."
        className="mb-6 px-5 py-3 border border-yellow-400 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500
                   transition duration-150 w-full sm:w-1/2"
      />

      <div className='overflow-x-auto bg-white shadow-lg rounded-lg max-h-[520px] overflow-y-auto border border-blue-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-blue-100 sticky top-0 z-10'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={`px-6 py-3 text-center text-xs font-semibold tracking-wider
                        select-none cursor-pointer
                        ${canSort ? 'hover:bg-blue-200 text-blue-700' : 'text-gray-500'}`}
                      role={canSort ? 'button' : undefined}
                      tabIndex={canSort ? 0 : undefined}
                      aria-sort={
                        isSorted ? (isSorted === 'asc' ? 'ascending' : 'descending') : 'none'
                      }
                    >
                      <div className='flex items-center justify-center gap-1 select-none'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSorted === 'asc' && <span className='text-blue-600'>▲</span>}
                        {isSorted === 'desc' && <span className='text-blue-600'>▼</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400 italic">
                  Loading transactions...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 italic">
                  No transactions found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-yellow-50 transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={
                        cell.column.id === 'description'
                          ? 'px-6 py-4 text-center text-sm text-gray-700 break-words whitespace-normal max-w-xs mx-auto'
                          : 'px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700'
                      }
                    >
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
  );
};

export default Crud;