"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

function DataTable({
  data,
  columns,
  keyExtractor,
  actions,
  noDataMessage = "No data found.",
  className = "",
  rowClassName = (index) => (index % 2 === 0 ? "bg-white" : "bg-primary-50"),
  roleMap,
  currentUserId,
  totalItems,
  totalPages,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page) => {
    if (totalPages && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`overflow-x-auto rounded-xl shadow-lg ${className}`}>
        <table className="w-full bg-white border border-gray-200 rounded-xl">
          <thead className="bg-primary-900 text-white text-sm uppercase">
            <tr>
              <th className="px-3 py-3 font-bold text-left whitespace-nowrap">#</th>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3 font-bold text-left whitespace-nowrap">
                  {column.header}
                </th>
              ))}
              {actions && <th className="px-3 py-3 font-bold text-left whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-200 text-primary-900">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={keyExtractor(item)} className={`${rowClassName(index)} hover:bg-primary-100`}>
                  <td className="px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-2 ${column.key === "size" || column.key === "colors" ? "max-w-20" : ""}`}>
                      {column.render
                        ? column.render(item, index)
                        : column.key === "role" && roleMap
                          ? roleMap[item[column.key]]
                          : item[column.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 flex space-x-2 items-center">{actions(item)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalItems && totalPages && totalPages >= 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

