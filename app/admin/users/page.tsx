import { Metadata } from "next";
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Users Management",
};

const UsersOverviewPage = async (props: {
  searchParams: Promise<{
    page: string;
  }>;
}) => {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const { page = "1" } = searchParams;
  const { users, totalPages } = await getAllUsers({ page: Number(page) });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Users</h2>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.length !== 0 &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{formatId(user.id)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge variant="default">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user.id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog id={user.id} action={deleteUser} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {totalPages && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};

export default UsersOverviewPage;
