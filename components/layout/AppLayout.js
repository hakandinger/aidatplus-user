import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* ================================================= DESKTOP SIDEBAR ================================================= */}{" "}
      <div className="hidden lg:block">
        {" "}
        <Sidebar collapsed={sidebarCollapsed} />{" "}
      </div>{" "}
      {/* ================================================= MOBILE SIDEBAR ================================================= */}{" "}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {" "}
          {/* Overlay */}{" "}
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />{" "}
          {/* Sidebar */} <Sidebar />{" "}
        </div>
      )}{" "}
      {/* ================================================= MAIN CONTENT ================================================= */}{" "}
      <div
        className={` min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        } `}
      >
        {" "}
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
        />{" "}
        <main className="p-4 sm:p-6 lg:p-8"> {children} </main>{" "}
      </div>{" "}
    </div>
  );
}
