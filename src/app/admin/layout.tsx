import AdminSidebar from "@/ui/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-grow p-6 overflow-auto bg-background">
          {children}
      </div>
    </div>
  );
}