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
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
  {
    date: "2025-05-01",
    accountName: "Valentio",
    description: "Nabung",
    amount: 150000,
  },
];

const ResizableHead = ({ children, width, onMouseDown }) => (
  <th className="relative border px-2 text-center" style={{ width }}>
    <div>{children}</div>
    <div
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-blue-500"
    />
  </th>
);

const Crud = () => {
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="font-montserrat text-blue p-5">
        <h1 className="text-2xl font-semibold mb-4">Transaction</h1>
        <div className="mb-5 flex  text-yellow">
            <a href="/crud/add" className="bg-blue p-3 rounded-md">Add New Transaction</a>
            <div></div>
        </div>
        <div className="overflow-auto rounded-md border">
          <Table className="bg-white table-fixed">
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

          {/* SCROLLABLE BODY */}
          <div className="max-h-[500px] overflow-y-auto">
            <Table className="table-fixed">
              <TableBody>
                {dummyData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="border text-center whitespace-pre-wrap break-words" style={{ width: colWidths.no }}>
                      {index + 1}
                    </TableCell>
                    <TableCell className="border text-center whitespace-pre-wrap break-words" style={{ width: colWidths.date }}>
                      {item.date}
                    </TableCell>
                    <TableCell className="border text-center whitespace-pre-wrap break-words" style={{ width: colWidths.name }}>
                      {item.accountName}
                    </TableCell>
                    <TableCell className="border text-left px-2 whitespace-pre-wrap break-words" style={{ width: colWidths.desc }}>
                      {item.description}
                    </TableCell>
                    <TableCell className="border text-center whitespace-pre-wrap break-words" style={{ width: colWidths.amount }}>
                      Rp {item.amount.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crud;
