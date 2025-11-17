// src/components/SideMenu.tsx
import { Link, useLocation } from "react-router-dom";

type SideMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function SideMenu({ isOpen, onToggle }: SideMenuProps) {
  const { pathname } = useLocation();

  const menu = [
    { path: "/today", label: "오늘의 갓생", icon: "📅" },
    { path: "/history", label: "기록", icon: "📖" },
    { path: "/analysis", label: "분석", icon: "📊" },
    { path: "/settings", label: "설정", icon: "⚙️" },
  ];

  return (
    <aside
      className={`relative z-20 flex h-screen flex-col border-r bg-white transition-all duration-300 ${isOpen ? "w-56" : "w-16"} `}
    >
      {/* 상단 로고 + 토글 버튼 */}
      <div className="flex items-center justify-between px-3 py-4">
        {isOpen && <span className="text-sm font-semibold">GodLife</span>}
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
          aria-label="사이드바 열기/닫기"
        >
          <span>{isOpen ? "«" : "»"}</span>
        </button>
      </div>

      {/* 메뉴 목록 */}
      <nav className="mt-2 flex flex-1 flex-col gap-1">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive ? "bg-black text-white" : "text-slate-600 hover:bg-slate-100"} `}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
