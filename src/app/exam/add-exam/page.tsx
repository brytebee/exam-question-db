import AddExamForm from "@/components/add-exam";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function page() {
  const session = await getServerSession(authOptions);
  console.log({ session });

  return <AddExamForm />;
}
