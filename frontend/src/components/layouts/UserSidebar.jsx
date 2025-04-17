import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

export const UserSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <UserNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${
          isSidebarOpen ? "open" : "d-none"
        }`}
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <a href="./index.html" className="brand-link">
            <span className="brand-text fw-light">User</span>
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
              {/* Book Appointment */}
              <li className="nav-item">
                <Link to="addappointment" className="nav-link">
                  <i className="nav-icon bi bi-calendar-check" />
                  <p>Book Appointment</p>
                </Link>
              </li>

              {/* View Appointment */}
              <li className="nav-item">
                <Link to="viewappointment" className="nav-link">
                  <i className="nav-icon bi bi-eye" />
                  <p>View Appointment</p>
                </Link>
              </li>

              {/* Prescription */}
              <li className="nav-item">
                <Link to="prescription" className="nav-link">
                  <i className="nav-icon bi bi-file-medical" />
                  <p>Prescription</p>
                </Link>
              </li>

              {/* Telemedicine */}
              <li className="nav-item">
                <Link to="patienttelemedicine" className="nav-link active">
                  <i className="nav-icon bi bi-camera-video-fill" />
                  <p>Telemedicine</p>
                </Link>
              </li>

              {/* Reminder */}
              <li className="nav-item">
                <Link to="patientreminder" className="nav-link active">
                  <i className="nav-icon bi bi-bell-fill" />
                  <p>Reminder</p>
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
