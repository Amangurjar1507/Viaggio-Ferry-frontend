// src/pages/CompanyAddTrip.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import AddTripForm from "../components/trips/AddTripForm";

export default function CompanyAddTrip() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <button className="btn btn-turquoise" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i> Back to List
            </button>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Create Ferry Trip</h5>
                  </div>
                </div>
                <div className="card-body">
                  {/* AddTripForm Component */}
                  <AddTripForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
