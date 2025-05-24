import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyData = [
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  // ... tambahkan data lainnya
];

const ResizableHead = ({ children, width, onMouseDown }) => (
  <th className="relative border px-2 text-center text-xs md:text-sm lg:text-base" style={{ width }}>
    <div>{children}</div>
    <div
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-[2px] cursor-col-resize"
    />
  </th>
);

const Crud = () => {
  const [showModal, setShowModal] = useState(false);
  const [colWidths, setColWidths] = useState({
    no: 50,
    date: 150,
    name: 200,
    desc: 300,
    amount: 150,
  });

  const isDragging = useRef(false);
  const currentCol = useRef(null);

  const handleMouseDown = (key) => (e) => {
    isDragging.current = true;
    currentCol.current = key;
    const startX = e.clientX;
    const startWidth = colWidths[key];

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const newWidth = startWidth + e.clientX - startX;
      setColWidths((prev) => ({ ...prev, [key]: Math.max(newWidth, 50) }));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      currentCol.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="min-h-screen bg-white text-xs md:text-sm lg:text-base">
      <Navbar />
      <div className="font-montserrat text-blue p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">Transaction</h1>

        <div className="mb-5 flex text-yellow">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue px-4 py-2 rounded-md text-xs md:text-sm"
          >
            Add New Transaction
          </button>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-yellow/25 backdrop-blur-sm text-blue">
              <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative text-sm">
                <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowModal(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Account Name</label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                      type="number"
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-red-500 rounded text-yellow hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue text-yellow rounded hover:bg-blue-950"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto rounded-md border">
          <div className="min-w-[600px]">
            <Table className="bg-white w-full">
              <TableHeader className="bg-yellow">
                <tr>
                  <ResizableHead width={colWidths.no} onMouseDown={handleMouseDown("no")}>No</ResizableHead>
                  <ResizableHead width={colWidths.date} onMouseDown={handleMouseDown("date")}>Date</ResizableHead>
                  <ResizableHead width={colWidths.name} onMouseDown={handleMouseDown("name")}>Account Name</ResizableHead>
                  <ResizableHead width={colWidths.desc} onMouseDown={handleMouseDown("desc")}>Description</ResizableHead>
                  <ResizableHead width={colWidths.amount} onMouseDown={handleMouseDown("amount")}>Amount</ResizableHead>
                </tr>
              </TableHeader>
            </Table>

            <div className="max-h-[500px] overflow-y-auto">
              <Table className="w-full">
                <TableBody>
                  {dummyData.map((item, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-yellow/10 transition-colors duration-200"
                    >
                      <TableCell
                        className="border text-center px-2 whitespace-pre-wrap break-words"
                        style={{ width: colWidths.no }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className="border text-center px-2 whitespace-pre-wrap break-words"
                        style={{ width: colWidths.date }}
                      >
                        {item.date}
                      </TableCell>
                      <TableCell
                        className="border text-center px-2 whitespace-pre-wrap break-words"
                        style={{ width: colWidths.name }}
                      >
                        {item.accountName}
                      </TableCell>
                      <TableCell
                        className="border text-left px-2 whitespace-pre-wrap break-words"
                        style={{ width: colWidths.desc }}
                      >
                        {item.description}
                      </TableCell>
                      <TableCell
                        className="border text-center px-2 whitespace-pre-wrap break-words"
                        style={{ width: colWidths.amount }}
                      >
                        Rp {item.amount.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-500 md:hidden">
          Geser tabel ke kanan &rarr; untuk lihat semua kolom.
        </p>
      </div>
    </div>
  );
};

export default Crud;
