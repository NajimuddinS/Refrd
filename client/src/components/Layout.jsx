import { useAuth } from "../context/AuthContext";
import { useLocation, NavLink } from "react-router-dom";
import { useState } from "react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 flex z-40 transform transition ease-in-out duration-300">
          <div
            className={`relative flex-1 flex flex-col w-64 max-w-xs bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-gray-600 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-2 rounded-lg font-bold text-xl tracking-tighter">
                    <span className="text-blue-200">R</span>
                    <span className="text-blue-100">e</span>
                    <span className="text-indigo-100">f</span>
                    <span className="text-indigo-200">r</span>
                    <span className="text-indigo-300">d</span>
                  </span>
                </div>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <svg
                    className={`mr-4 h-5 w-5 flex-shrink-0 ${
                      location.pathname === "/dashboard" 
                        ? "text-blue-400" 
                        : "text-gray-400 group-hover:text-blue-300"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/candidates"
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <svg
                    className={`mr-4 h-5 w-5 flex-shrink-0 ${
                      location.pathname === "/candidates" 
                        ? "text-blue-400" 
                        : "text-gray-400 group-hover:text-blue-300"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Candidates
                </NavLink>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate max-w-[140px]">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-300 truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  title="Logout"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-2 rounded-lg font-bold text-xl tracking-tighter shadow-md">
                  <span className="text-blue-200">R</span>
                  <span className="text-blue-100">e</span>
                  <span className="text-indigo-100">f</span>
                  <span className="text-indigo-200">r</span>
                  <span className="text-indigo-300">d</span>
                </span>
              </div>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <svg
                  className={`mr-4 h-5 w-5 flex-shrink-0 ${
                    location.pathname === "/dashboard" 
                      ? "text-blue-400" 
                      : "text-gray-400 group-hover:text-blue-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </NavLink>
              <NavLink
                to="/candidates"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <svg
                  className={`mr-4 h-5 w-5 flex-shrink-0 ${
                    location.pathname === "/candidates" 
                      ? "text-blue-400" 
                      : "text-gray-400 group-hover:text-blue-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Candidates
              </NavLink>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white truncate max-w-[140px]">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-gray-300 truncate max-w-[140px]">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                title="Logout"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;