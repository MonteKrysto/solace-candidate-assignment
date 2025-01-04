"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/db/schema";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DebounceInput, Table } from "@/app/components";
import { useAdvocates } from "@/app/hooks/useAdvocates";

/**
 * Search for advocates
 * 
 * Provides a search input to filter advocates
 * and paginated results
 */
const AdvocatesSearch = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const { data, isLoading, error } = useAdvocates({
    page,
    pageSize,
    search,
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns: ColumnDef<Advocate>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "degree",
      header: "Degree",
    },
    {
      accessorKey: "specialties",
      header: "Specialties",
      cell: (info) => (info.getValue() as string[]).join(", "),
    },
    {
      accessorKey: "yearsOfExperience",
      header: "Years of Experience",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
  ];

  /**
   * Configure react-table for the advocates data
   * and pagination
   */
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: true,
  });

  /**
   * Update the search value
   *
   * @param {string} value
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  /**
   * Get the next page of results
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  const handleNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (page < (data?.totalPages ?? 0)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  /**
   * Get the previous page of results
   */
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full mt-2 px-2">
        <div className="space-y-4 bg-white p-4 shadow-md rounded-lg">
          <div className="flex items-center w-full">
            <DebounceInput
              value={search}
              onChange={handleSearchChange}
              className="p-2 w-full border rounded-lg"
              placeholder="Search advocates..."
              debounceDelay={300}
            />
          </div>
  
          <div className="overflow-x-auto" style={{ minHeight: '800px' }}>
            <Table className="w-full">
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.HeaderCell key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
  
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {page} of {data?.totalPages}
              </strong>
            </span>
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={handleNextPage}
              disabled={page >= (data?.totalPages ?? 0)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdvocatesSearch };
