import React, { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

/**
 * A generic table component that can be used to render tables.
 */
type ComponentWithChildren = {
  children: ReactNode
  className?: string
}

const TableHeader: React.FC<ComponentWithChildren> = ({ children, className }) => (
  <thead className={cn("bg-gray-100", className)}>
    {children}
  </thead>
)

const TableBody: React.FC<ComponentWithChildren> = ({ children, className }) => (
  <tbody className={cn("divide-y divide-gray-200 bg-white", className)}>
    {children}
  </tbody>
)

const TableRow: React.FC<ComponentWithChildren> = ({ children, className }) => (
  <tr className={cn("", className)}>
    {children}
  </tr>
)

const TableCell: React.FC<ComponentWithChildren> = ({ children, className }) => (
  <td className={cn("px-3 py-4 text-sm text-gray-500", className)}>
    {children}
  </td>
)

const TableHeaderCell: React.FC<ComponentWithChildren> = ({ children, className }) => (
  <th className={cn("py-3.5 px-3 text-left text-sm font-semibold text-gray-900", className)}>
    {children}
  </th>
)

type TableComponent = React.FC<ComponentWithChildren> & {
  Header: typeof TableHeader
  Body: typeof TableBody
  Row: typeof TableRow
  Cell: typeof TableCell
  HeaderCell: typeof TableHeaderCell
}

const Table: TableComponent = ({ children, className }) => {
  // Make sure ONLY Table sub-components are used and throw an
  // error if any other component is used as a child of <Table>
  const allowedTypes = [TableHeader, TableBody, TableRow, TableCell, TableHeaderCell];

  // Validate children
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (!allowedTypes.includes(child.type as any)) {
        throw new Error("Invalid child component. Only Table sub-components are allowed.");
      }
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-gray-300", className)}>
        {children}
      </table>
    </div>
  );
};

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.HeaderCell = TableHeaderCell

export { Table }
