import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { PAGE_SIZE } from "@/lib/constants";
import { Metadata } from "next";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "All Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  await requireAdmin();
  const { page = "1" } = await props.searchParams;
  const { orders, totalPages } = await getAllOrders({
    page: Number(page),
    limit: PAGE_SIZE || 10,
  });
  return (
    <div className="space-y-4 mt-12">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {formatId(order.id)}
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatCurrency(order.totalPrice.toString())}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Not Delivered"}
                </TableCell>
                <TableCell className="flex gap-1 justify-center">
                  <Button asChild variant="outline" size={"sm"}>
                    <Link
                      href={`/order/${order.id}`}
                      className="text-blue-500 ml-2 hover:underline"
                    >
                      View
                    </Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
