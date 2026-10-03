import GlobalSearch from "@/features/search/components/GlobalSearch";
import Sidebar from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="min-w-0 md:ml-64">
        <header className="flex h-16 items-center border-b border-border px-4 sm:px-6">
          <div className="flex w-full justify-center pl-12 md:pl-0">
            <GlobalSearch />
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}