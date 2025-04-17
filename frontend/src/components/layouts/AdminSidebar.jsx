import React, { useState } from 'react'
import { AdminNavbar } from './AdminNavbar'
import { Link, Outlet } from 'react-router-dom'

export const AdminSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${
          isSidebarOpen ? "open" : "d-none"
        }`}
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <a href="./index.html" className="brand-link">
            <span className="brand-text fw-light">Admin</span>
          </a>
        </div>

        <div
          className=""
          data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}
          style={{
            marginRight: "-16px",
            marginBottom: "-16px",
            marginLeft: 0,
            top: "-8px",
            right: "auto",
            left: "-8px",
            width: "calc(100% + 16px)",
            padding: 8,
          }}
        >
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              data-lte-toggle="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item menu-open">
                <Link to="adddoctorprofile" className="nav-link active">
                  <i className="nav-icon bi bi-speedometer" />
                  <p>
                    Add Doctor Profile
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="viewdoctorprofile" className="nav-link active">
                      <i className="nav-icon bi bi-speedometer" />
                      <p>
                        View Doctor Profile
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link to="viewpatient" className="nav-link">
                  <i className="nav-icon bi bi-file-medical" />
                  <p>View Patient</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="adminehr" className="nav-link">
                  <i className="nav-icon bi bi-file-medical" />
                  <p>Electronic Health Records</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
