import Link from "next/link";
import { useRouter } from "next/router";
const menuItems = [
  { title: "Anasayfa", href: "/", icon: "🏠" },
  { title: "Bloklar", href: "/bloklar", icon: "🏢" }, 
  { title: "Giderler", href: "/giderler", icon: "💸" },  
  { title: "Duyurular", href: "/duyurular", icon: "📢" },
];
const systemItems = [{ title: "Ayarlar", href: "/ayarlar", icon: "⚙️" }];
export default function Sidebar({ collapsed = false }) {
  const router = useRouter();
  const isActive = (href) => {
    if (href === "/") {
      return router.pathname === "/";
    }
    return router.pathname.startsWith(href);
  };
  return (
    <aside
      className={` fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } `}
    >
      {" "}
      {/* Logo */}{" "}
      <div className="flex h-16 items-center border-b border-gray-100 px-4">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 font-bold text-white">
            {" "}
            A{" "}
          </div>{" "}
          {!collapsed && (
            <div>
              {" "}
              <h1 className="text-lg font-bold text-gray-900">
                {" "}
                AidatPlus{" "}
              </h1>{" "}
              <p className="text-[10px] text-gray-400">
                {" "}
                Apartman Yönetimi{" "}
              </p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {/* Menü */}{" "}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {" "}
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {" "}
            Yönetim{" "}
          </p>
        )}{" "}
        <div className="space-y-1">
          {" "}
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={` group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""} `}
              >
                {" "}
                <span
                  className={` flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base ${
                    active ? "bg-white/10" : "bg-gray-50 group-hover:bg-white"
                  } `}
                >
                  {" "}
                  {item.icon}{" "}
                </span>{" "}
                {!collapsed && <span>{item.title}</span>}{" "}
              </Link>
            );
          })}{" "}
        </div>{" "}
        <div className="my-6 border-t border-gray-100" />{" "}
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {" "}
            Yönetici Paneli{" "}
          </p>
        )}{" "}
        <div className="space-y-1">
          {" "}
          {systemItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={` flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""} `}
              >
                {" "}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                  {" "}
                  {item.icon}{" "}
                </span>{" "}
                {!collapsed && <span>{item.title}</span>}{" "}
              </Link>
            );
          })}{" "}
        </div>{" "}
      </nav>{" "}
      {/* Kullanıcı */}{" "}
      <div className="border-t border-gray-100 p-3">
        {" "}
        <div
          className={` flex items-center gap-3 rounded-xl bg-gray-50 p-3 ${
            collapsed ? "justify-center" : ""
          } `}
        >
          {" "}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            {" "}
            A{" "}
          </div>{" "}
          {!collapsed && (
            <div className="min-w-0">
              {" "}
              <p className="truncate text-sm font-semibold text-gray-800">
                {" "}
                Bina Sakini{" "}
              </p>{" "}
              <p className="truncate text-xs text-gray-400">
                {" "}
                AidatPlus{" "}
              </p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </aside>
  );
}
