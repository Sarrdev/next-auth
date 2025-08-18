import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-xl font-bold border-b">Admin Panel</div>
      <nav className="p-4 space-y-2">
        <Link href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-200">
          Dashboard
        </Link>
        <Link href="/admin/users" className="block p-2 rounded hover:bg-gray-200">
          Utilisateurs
        </Link>
        <Link href="/admin/settings" className="block p-2 rounded hover:bg-gray-200">
          Paramètres
        </Link>
      </nav>
    </aside>
  );
}
