'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { FaFileExcel, FaUserPlus } from 'react-icons/fa'

const DataTable = ({
  columns,
  data,
  actions,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  formData,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  const roleLabels = {
    1995: 'admin',
    1996: 'seller',
    2004: 'user',
  }

  const handlePageChange = (page) => {
    if (onPageChange) onPageChange(page)
  }

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value, 10)
    if (onItemsPerPageChange) onItemsPerPageChange(newLimit)
  }

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key]
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  )

  const exportToCSV = (data, columns) => {
    const header = columns.map((col) => col.label).join(',')
    const rows = data.map((row) =>
      columns
        .map((col) => {
          let val = row[col.key]
          if (col.key === 'role') val = roleLabels[val]
          return `"${val ?? ''}"`
        })
        .join(',')
    )

    const csvContent = [header, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', 'data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 md:mb-0 p-2 border text-slate-900 rounded-md w-full md:w-auto"
        />
        <div className="flex gap-2 md:gap-4 mt-2 md:mt-0 *:justify-center *:flex-1 md:*:flex-none">
          <Button
            onClick={() => exportToCSV(filteredData, columns)}
            variant="outline"
            className="flex gap-2 items-center text-sm"
          >
            <FaFileExcel className="text-lg" /> Export CSV
          </Button>
          <Button className="flex gap-2 items-center text-sm">
            <FaUserPlus className="text-lg" />
            <Link
              className="capitalize"
              href={`/dashboard/${formData.link}/create`}
            >
              Add New {formData.name}
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-[600px] w-full divide-y divide-slate-200 text-sm text-slate-800">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="p-4 capitalize text-slate-500"
                >
                  No {formData.link} Found
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render
                        ? col.render(row)
                        : col.key === 'role'
                          ? roleLabels[row[col.key]]
                          : col.key === 'username' && row._id === user?._id
                            ? `${row[col.key]} (You)`
                            : col.key === 'category'
                              ? row[col.key]?.name
                              : col.key === 'price'
                                ? `${row[col.key]} L.E`
                                : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex justify-content-center w-full items-center gap-2">
                        {actions.map((ActionComponent, i) => (
                          <ActionComponent key={i} row={row} />
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <label htmlFor="itemsPerPage" className="text-sm">
            Rows per page:
          </label>
          <select
            id="itemsPerPage"
            value={pagination.itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default DataTable
