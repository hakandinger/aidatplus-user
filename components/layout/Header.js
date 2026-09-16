import { useState } from "react";
export default function Header({ onMenuClick, onSidebarToggle }) {
  const [search, setSearch] = useState("");
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/95 backdrop-blur">
      {" "}
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {" "}
        {/* Sol taraf */}{" "}
        <div className="flex items-center gap-3">
          {" "}
          {/* Mobil menü */}{" "}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Menüyü aç"
          >
            {" "}
            ☰{" "}
          </button>{" "}
          {/* Sidebar */}{" "}
          <button
            type="button"
            onClick={onSidebarToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 lg:flex"
            aria-label="Menüyü daralt"
          >
            {" "}
            ☰{" "}
          </button>{" "}
          {/* Arama */}{" "}
          <div className="relative hidden md:block">
            {" "}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {" "}
              🔎{" "}
            </span>{" "}
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Daire, kişi veya işlem ara..."
              className=" h-10 w-72 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white "
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Sağ taraf */}{" "}
        <div className="flex items-center gap-2">
          {" "}
          {/* Bildirim */}{" "}
          <button
            type="button"
            className=" relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 "
            aria-label="Bildirimler"
          >
            {" "}
            🔔{" "}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />{" "}
          </button>{" "}
          {/* Kullanıcı */}{" "}
          <button
            type="button"
            className=" flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 "
          >
            {" "}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {" "}
              A{" "}
            </div>{" "}
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {" "}
              Bina Sakini{" "}
            </span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
