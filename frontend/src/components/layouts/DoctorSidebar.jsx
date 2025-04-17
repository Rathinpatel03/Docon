import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DoctorNavbar } from "./DoctorNavbar";

export const DoctorSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <DoctorNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${
          isSidebarOpen ? "open" : "d-none"
        }`}
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <Link to="" className="nav-link active">
            <span className="brand-text fw-light">Doctor</span>
          </Link>
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
                <Link to="myappointments" className="nav-link active">
                  <i className="nav-icon bi bi-calendar-check-fill" />
                  <p>
                    Appointments
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="doctorprescription" className="nav-link active">
                      <i className="nav-icon bi bi-file-earmark-medical" />
                      <p>
                        E-prescription
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="doctortelemedicine" className="nav-link active">
                      <i className="nav-icon bi bi-camera-video-fill" />
                      <p>
                        Telemedicine
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="app-main">
        <Outlet></Outlet>
      </main>
    </>
  );
};
