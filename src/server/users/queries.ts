import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireGuest() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
}