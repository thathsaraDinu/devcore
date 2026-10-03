"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  if (isPending) {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm text-text-secondary">
        {session.user.name}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="cursor-pointer text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        Sign out
      </button>
    </div>
  );
}