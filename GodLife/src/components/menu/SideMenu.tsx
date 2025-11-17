import { Link, useLocation } from "react-router-dom";

export default function SideMenu() {
  const { pathname } = useLocation();

  const menu = [
    { path: "/home", label: "오늘의 갓생" },
    { path: "/history", label: "기록" },
    { path: "/analysis", label: "분석" },
    { path: "/settings", label: "설정" },
  ];

  return (
    <aside className="min-h-screen w-48 border-r bg-white p-4">
      <h2 className="mb-6 text-xl font-bold">은향이의 갓생 기록</h2>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`rounded px-3 py-2 text-sm font-medium ${
              pathname === item.path
                ? "bg-black text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
