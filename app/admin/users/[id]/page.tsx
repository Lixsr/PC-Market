import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/actions/user.actions";
import UpdateUserForm from "./UpdateUserForm";

export const metadata: Metadata = {
  title: "Update user",
};

const UpdateUserPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="h2-bold">Update User</h2>
      <UpdateUserForm user={user}/>
    </div>
  );
};

export default UpdateUserPage;
