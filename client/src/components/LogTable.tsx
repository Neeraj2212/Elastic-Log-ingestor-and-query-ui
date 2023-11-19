import { TableRowData } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface LogTableProps {
  tableData: TableRowData[];
}

export default function LogTable({ tableData }: LogTableProps) {
  return (
    <div className="px-10 h-screen lg:max-h-[775px] overflow-auto">
      <Table>
        <TableHeader className="bg-primary sticky">
          <TableHead className="text-primary-foreground font-semibold">
            Level
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Message
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Resource Id
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Trace ID
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Span ID
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Commit
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Timestamp
          </TableHead>
          <TableHead className="text-primary-foreground font-semibold">
            Parent Resource Id
          </TableHead>
        </TableHeader>
        <TableBody>
          {tableData.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No logs found
              </TableCell>
            </TableRow>
          )}
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.level}</TableCell>
              <TableCell>{row.message}</TableCell>
              <TableCell>{row.resourceId}</TableCell>
              <TableCell>{row.traceId}</TableCell>
              <TableCell>{row.spanId}</TableCell>
              <TableCell>{row.commit}</TableCell>
              <TableCell>{row["@timestamp"]}</TableCell>
              <TableCell>{row.metadata.parentResourceId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
