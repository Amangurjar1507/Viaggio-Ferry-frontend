// src/pages/CompanyAddTrip.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useNavigate } from "react-router-dom";
import { shipsApi } from "../api/shipsApi";
import { portsApi } from "../api/portsApi";
import { tripsApi } from "../api/tripsApi";
import Swal from "sweetalert2";

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;

export default function CompanyAddTrip() {
  const navigate = useNavigate();

  // Dropdown data
  const [ships, setShips] = useState([]);
  const [ports, setPorts] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Tab states (main tabs and inner availability tabs)
  const [mainTab, setMainTab] = useState("details"); // details | availability | ticketing
  const [availInnerTab, setAvailInnerTab] = useState("add"); // add | allocate

  // Trip details form (uncontrolled fields can be converted later)
  const [form, setForm] = useState({
    code: "",
    vessel: "",
    departurePort: "",
    arrivalPort: "",
    departureAt: "",
    arrivalAt: "",
    status: "Scheduled",
    bookingOpen: "",
    bookingClose: "",
    checkinOpen: "",
    checkinClose: "",
    boardingClose: "",
    promotion: "",
    remarks: ""
  });

  // Availability lines
  const [passengers, setPassengers] = useState([
    { id: makeId("p_"), trip: "", cabin: "First class", seats: "" }
  ]);
  const [cargo, setCargo] = useState([
    { id: makeId("c_"), trip: "", type: "Pallet", spots: "" }
  ]);
  const [vehicles, setVehicles] = useState([
    { id: makeId("v_"), trip: "", type: "Car", spots: "" }
  ]);

  // Agents allocation blocks (each has passengerLines, cargoLines, vehicleLines)
  const [agents, setAgents] = useState([
    {
      id: makeId("a_"),
      trip: "",
      agentName: "Agent Alpha",
      passengerLines: [{ id: makeId("ap_"), select: "", qty: "" }],
      cargoLines: [{ id: makeId("ac_"), select: "", qty: "" }],
      vehicleLines: [{ id: makeId("av_"), select: "", qty: "" }]
    }
  ]);

  // Ticketing rules
  const [tripRules, setTripRules] = useState([
    { id: makeId("r_"), trip: "", ruleType: "Void", ruleName: "" }
  ]);

  // Fetch ships and ports on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch ships, ports, and trips in parallel
      const [shipsRes, portsRes, tripsRes] = await Promise.all([
        shipsApi.getShips(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ships:", err);
          return { data: { ships: [] } };
        }),
        portsApi.getPorts(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ports:", err);
          return { data: { ports: [] } };
        }),
        tripsApi.getTrips(1, 100, "").catch(err => {
          console.error("[v0] Error fetching trips:", err);
          return { data: { trips: [] } };
        })
      ]);

      // Extract data from responses
      const shipsList = shipsRes?.data?.ships || [];
      const portsList = portsRes?.data?.ports || [];
      const tripsList = tripsRes?.data?.trips || [];

      console.log("[v0] Ships loaded:", shipsList);
      console.log("[v0] Ports loaded:", portsList);
      console.log("[v0] Trips loaded:", tripsList);

      setShips(shipsList);
      setPorts(portsList);
      setTrips(tripsList);
    } catch (err) {
      console.error("[v0] Error fetching dropdown data:", err);
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Could not load ships, ports and trips data. Using empty lists."
      });
    } finally {
      setLoadingData(false);
    }
  };
    } catch (err) {
      console.error("[v0] Error fetching dropdown data:", err);
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Could not load ships and ports data. Using empty lists."
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Handlers for form changes
  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Passenger handlers
  const addPassenger = () => setPassengers((p) => [...p, { id: makeId("p_"), cabin: "First class", seats: "" }]);
  const removePassenger = (id) => setPassengers((p) => p.filter((x) => x.id !== id));
  const updatePassenger = (id, key, value) => setPassengers((p) => p.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Cargo handlers
  const addCargo = () => setCargo((c) => [...c, { id: makeId("c_"), type: "Pallet", spots: "" }]);
  const removeCargo = (id) => setCargo((c) => c.filter((x) => x.id !== id));
  const updateCargo = (id, key, value) => setCargo((c) => c.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Vehicle handlers
  const addVehicle = () => setVehicles((v) => [...v, { id: makeId("v_"), type: "Car", spots: "" }]);
  const removeVehicle = (id) => setVehicles((v) => v.filter((x) => x.id !== id));
  const updateVehicle = (id, key, value) => setVehicles((v) => v.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Agents handlers
  const addAgent = () =>
    setAgents((a) => [
      ...a,
      {
        id: makeId("a_"),
        agentName: "",
        passengerLines: [{ id: makeId("ap_"), select: "", qty: "" }],
        cargoLines: [{ id: makeId("ac_"), select: "", qty: "" }],
        vehicleLines: [{ id: makeId("av_"), select: "", qty: "" }]
      }
    ]);
  const removeAgent = (id) => setAgents((a) => a.filter((ag) => ag.id !== id));

  const addAgentLine = (agentId, section) => {
    setAgents((a) =>
      a.map((ag) => {
        if (ag.id !== agentId) return ag;
        const newLine = { id: makeId(section + "_"), select: "", qty: "" };
        return { ...ag, [`${section}Lines`]: [...ag[`${section}Lines`], newLine] };
      })
    );
  };

  const removeAgentLine = (agentId, section, lineId) => {
    setAgents((a) =>
      a.map((ag) => (ag.id !== agentId ? ag : { ...ag, [`${section}Lines`]: ag[`${section}Lines`].filter((l) => l.id !== lineId) }))
    );
  };

  const updateAgentLine = (agentId, section, lineId, key, value) => {
    setAgents((a) =>
      a.map((ag) =>
        ag.id !== agentId
          ? ag
          : { ...ag, [`${section}Lines`]: ag[`${section}Lines`].map((l) => (l.id === lineId ? { ...l, [key]: value } : l)) }
      )
    );
  };

  // Trip rules handlers
  const addTripRule = () => setTripRules((r) => [...r, { id: makeId("r_"), ruleType: "Void", ruleName: "" }]);
  const removeTripRule = (id) => setTripRules((r) => r.filter((x) => x.id !== id));
  const updateTripRule = (id, key, value) => setTripRules((r) => r.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Save handlers (currently mock)
  const onSaveTrip = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.code || !form.vessel || !form.departurePort || !form.arrivalPort || !form.departureAt || !form.arrivalAt) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields (Trip Code, Vessel, Departure Port, Arrival Port, Departure Date/Time, Arrival Date/Time)"
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Creating Trip",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare API payload matching the backend requirements
      const payload = {
        tripName: form.code, // Use trip code as name if tripName not in form
        tripCode: form.code,
        ship: form.vessel, // Ship ID
        departurePort: form.departurePort, // Port ID
        arrivalPort: form.arrivalPort, // Port ID
        departureDateTime: form.departureAt,
        arrivalDateTime: form.arrivalAt,
        status: form.status || "SCHEDULED",
        bookingOpeningDate: form.bookingOpen || null,
        bookingClosingDate: form.bookingClose || null,
        checkInOpeningDate: form.checkinOpen || null,
        checkInClosingDate: form.checkinClose || null,
        boardingClosingDate: form.boardingClose || null
      };

      console.log("[v0] Trip API payload:", payload);

      // Call the API
      const response = await tripsApi.createTrip(payload);
      
      console.log("[v0] Trip created successfully:", response);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Trip created successfully!",
        confirmButtonText: "OK"
      }).then(() => {
        // Optionally navigate back to trips list
        navigate('/company/ship-trip/trips');
      });
    } catch (error) {
      console.error("[v0] Error creating trip:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create trip. Please try again."
      });
    }
  };

  const onSaveAvailability = () => {
    const payload = { passengers, cargo, vehicles, agents };
    console.log("Availability saved", payload);
    alert("Availability saved (mock)");
  };

  // JSX: keep the same classes as HTML (converted to className)
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
                  {/* preserve small style block from original for capacity-grid etc. */}
                  <style>{`
                    .hidden { display: none !important; }
                    .capacity-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; }
                    @media (max-width: 767px) { .capacity-grid { grid-template-columns: 1fr; } }
                    .allocation-section { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                    .agent-block { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                  `}</style>

                  <div>
                    {/* Main Tabs */}
                    <ul className="nav nav-tabs mb-3">
                      <li className="nav-item">
                        <button
                          id="tripDetailsBtn"
                          className={`nav-link tab-button ${mainTab === "details" ? "active" : ""}`}
                          onClick={() => setMainTab("details")}
                        >
                          Trip Details
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          id="availabilityBtn"
                          className={`nav-link tab-button ${mainTab === "availability" ? "active" : ""}`}
                          onClick={() => setMainTab("availability")}
                        >
                          Availability Management
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          id="tripTicketingRulesBtn"
                          className={`nav-link tab-button ${mainTab === "ticketing" ? "active" : ""}`}
                          onClick={() => setMainTab("ticketing")}
                        >
                          Trip Ticketing Rules
                        </button>
                      </li>
                    </ul>

                    {/* Trip Details */}
                    <div id="tripDetailsTab" className={mainTab === "details" ? "" : "hidden"}>
                      <form className="row g-3" onSubmit={onSaveTrip}>
                        <div className="col-md-6">
                          <label className="form-label">Trip Name/Code</label>
                          <input type="text" className="form-control" name="code" value={form.code} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Assign Vessel</label>
                          <select className="form-select" name="vessel" value={form.vessel} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Ship --</option>
                            {ships.map((ship) => (
                              <option key={ship._id} value={ship._id}>
                                {ship.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ships...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Departure Port</label>
                          <select className="form-select" name="departurePort" value={form.departurePort} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Port --</option>
                            {ports.map((port) => (
                              <option key={port._id} value={port._id}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ports...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Arrival Port</label>
                          <select className="form-select" name="arrivalPort" value={form.arrivalPort} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Port --</option>
                            {ports.map((port) => (
                              <option key={port._id} value={port._id}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ports...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Departure Date & Time</label>
                          <input type="datetime-local" className="form-control" name="departureAt" value={form.departureAt} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Arrival Date & Time</label>
                          <input type="datetime-local" className="form-control" name="arrivalAt" value={form.arrivalAt} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <select className="form-select" name="status" value={form.status} onChange={onFormChange}>
                            <option>Scheduled</option>
                            <option>Ongoing</option>
                            <option>Completed</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Booking Opening Date</label>
                          <input type="datetime-local" className="form-control" name="bookingOpen" value={form.bookingOpen} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Booking Closing Date</label>
                          <input type="datetime-local" className="form-control" name="bookingClose" value={form.bookingClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Check-in Opening Date</label>
                          <input type="datetime-local" className="form-control" name="checkinOpen" value={form.checkinOpen} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Check-in Closing Date</label>
                          <input type="datetime-local" className="form-control" name="checkinClose" value={form.checkinClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Boarding Closing Date</label>
                          <input type="datetime-local" className="form-control" name="boardingClose" value={form.boardingClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label">Promotion</label>
                          <select className="form-select" name="promotion" value={form.promotion} onChange={onFormChange}>
                            <option value="">None</option>
                            <option value="discount10">Discount 10%</option>
                            <option value="earlybird">Early Bird</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label">Remarks/Notes</label>
                          <textarea className="form-control" rows="3" name="remarks" value={form.remarks} onChange={onFormChange}></textarea>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                          <button type="submit" className="btn btn-turquoise">Save Trip</button>
                        </div>
                      </form>
                    </div>

                    {/* Availability Management */}
                    <div id="availabilityTab" className={mainTab === "availability" ? "" : "hidden"}>
                      {/* inner tabs */}
                      <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                          <button
                            id="addAvailabilityBtn"
                            className={`nav-link tab-button ${availInnerTab === "add" ? "active" : ""}`}
                            onClick={() => setAvailInnerTab("add")}
                          >
                            Add Availability
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            id="allocateAvailabilityBtn"
                            className={`nav-link tab-button ${availInnerTab === "allocate" ? "active" : ""}`}
                            onClick={() => setAvailInnerTab("allocate")}
                          >
                            Allocate to Agent
                          </button>
                        </li>
                      </ul>

                      {/* Add Availability Content */}
                      <div id="addAvailabilityContent" className={availInnerTab === "add" ? "" : "hidden"}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Select Trip</label>
                            <select className="form-select" value={form.trip || ""} onChange={(e) => setForm({ ...form, trip: e.target.value })}>
                              <option value="">-- Select a Trip --</option>
                              {trips.map((trip) => (
                                <option key={trip._id} value={trip._id}>
                                  {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                                </option>
                              ))}
                            </select>
                            {loadingData && <small className="text-muted">Loading trips...</small>}
                          </div>
                        </div>

                        <h5 className="mb-3">Passenger Availability</h5>
                        <div id="passenger-availability-container">
                          {passengers.map((p) => (
                            <div className="capacity-grid align-items-center mb-2" key={p.id}>
                              <select className="form-select" value={p.cabin} onChange={(e) => updatePassenger(p.id, "cabin", e.target.value)}>
                                <option>First class</option>
                                <option>Economy</option>
                              </select>
                              <input type="number" className="form-control" placeholder="Seats" value={p.seats} onChange={(e) => updatePassenger(p.id, "seats", e.target.value)} />
                              <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removePassenger(p.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" id="addPassengerLine" className="btn btn-sm btn-outline-secondary" onClick={addPassenger}>Add Line</button>

                        <h5 className="mt-4">Cargo Availability</h5>
                        <div id="cargo-availability-container">
                          {cargo.map((c) => (
                            <div className="capacity-grid align-items-center mb-2" key={c.id}>
                              <select className="form-select" value={c.type} onChange={(e) => updateCargo(c.id, "type", e.target.value)}>
                                <option>Pallet</option>
                                <option>Container</option>
                              </select>
                              <input type="number" className="form-control" placeholder="Spots" value={c.spots} onChange={(e) => updateCargo(c.id, "spots", e.target.value)} />
                              <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeCargo(c.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" id="addCargoLine" className="btn btn-sm btn-outline-secondary" onClick={addCargo}>Add Line</button>

                        <h5 className="mt-4">Vehicle Availability</h5>
                        <div id="vehicle-availability-container">
                          {vehicles.map((v) => (
                            <div className="capacity-grid align-items-center mb-2" key={v.id}>
                              <select className="form-select" value={v.type} onChange={(e) => updateVehicle(v.id, "type", e.target.value)}>
                                <option>Car</option>
                                <option>Truck</option>
                              </select>
                              <input type="number" className="form-control" placeholder="Spots" value={v.spots} onChange={(e) => updateVehicle(v.id, "spots", e.target.value)} />
                              <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeVehicle(v.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" id="addVehicleLine" className="btn btn-sm btn-outline-secondary" onClick={addVehicle}>Add Line</button>

                        <div className="text-end mt-3">
                          <button type="button" className="btn btn-success" onClick={onSaveAvailability}>Save Availability</button>
                        </div>
                      </div>

                      {/* Allocate to Agent */}
                      <div id="allocateAvailabilityContent" className={availInnerTab === "allocate" ? "" : "hidden"}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Select Trip for Allocation</label>
                            <select className="form-select" value={form.trip || ""} onChange={(e) => setForm({ ...form, trip: e.target.value })}>
                              <option value="">-- Select a Trip --</option>
                              {trips.map((trip) => (
                                <option key={trip._id} value={trip._id}>
                                  {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                                </option>
                              ))}
                            </select>
                            {loadingData && <small className="text-muted">Loading trips...</small>}
                          </div>
                        </div>

                        <h5 className="mb-3">Total Availability for Allocation</h5>
                        <div id="allocation-summary" className="mb-3">First class: 0 | Pallet: 0 | Car: 0</div>

                        <div id="agent-allocation-container">
                          {agents.map((agent) => (
                            <div className="agent-block" key={agent.id}>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6>Agent Details</h6>
                                <button type="button" className="btn btn-sm btn-danger remove-agent" onClick={() => removeAgent(agent.id)}>Remove Agent</button>
                              </div>

                              <select className="form-select mb-3" value={agent.agentName} onChange={(e) => setAgents((a) => a.map((ag) => (ag.id === agent.id ? { ...ag, agentName: e.target.value } : ag)))}>
                                <option>Agent Alpha</option>
                                <option>Agent Beta</option>
                              </select>

                              <div className="allocation-section">
                                <h6>Passenger Allocation</h6>
                                <div className="passenger-lines">
                                  {agent.passengerLines.map((line) => (
                                    <div className="capacity-grid align-items-center mb-2" key={line.id}>
                                      <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "select", e.target.value)}>
                                        <option>Select</option>
                                      </select>
                                      <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "qty", e.target.value)} />
                                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "passenger", line.id)}>Remove</button>
                                    </div>
                                  ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-secondary add-passenger-line" onClick={() => addAgentLine(agent.id, "passenger")}>Add Passenger Line</button>
                              </div>

                              <div className="allocation-section">
                                <h6>Cargo Allocation</h6>
                                <div className="cargo-lines">
                                  {agent.cargoLines.map((line) => (
                                    <div className="capacity-grid align-items-center mb-2" key={line.id}>
                                      <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "select", e.target.value)}>
                                        <option>Select</option>
                                      </select>
                                      <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "qty", e.target.value)} />
                                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "cargo", line.id)}>Remove</button>
                                    </div>
                                  ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-secondary add-cargo-line" onClick={() => addAgentLine(agent.id, "cargo")}>Add Cargo Line</button>
                              </div>

                              <div className="allocation-section">
                                <h6>Vehicle Allocation</h6>
                                <div className="vehicle-lines">
                                  {agent.vehicleLines.map((line) => (
                                    <div className="capacity-grid align-items-center mb-2" key={line.id}>
                                      <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "select", e.target.value)}>
                                        <option>Select</option>
                                      </select>
                                      <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "qty", e.target.value)} />
                                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "vehicle", line.id)}>Remove</button>
                                    </div>
                                  ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-secondary add-vehicle-line" onClick={() => addAgentLine(agent.id, "vehicle")}>Add Vehicle Line</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button type="button" id="addAgentLine" className="btn btn-sm btn-outline-secondary" onClick={addAgent}>Add Another Agent</button>

                        <div className="text-end mt-3">
                          <button type="button" className="btn btn-success" onClick={onSaveAvailability}>Save Allocation</button>
                        </div>
                      </div>
                    </div>

                    {/* Trip Ticketing Rules */}
                    <div id="tripTicketingRulesTab" className={mainTab === "ticketing" ? "" : "hidden"}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Select Trip for Rules</label>
                          <select className="form-select" value={form.trip || ""} onChange={(e) => setForm({ ...form, trip: e.target.value })}>
                            <option value="">-- Select a Trip --</option>
                            {trips.map((trip) => (
                              <option key={trip._id} value={trip._id}>
                                {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading trips...</small>}
                        </div>
                      </div>

                      <h5 className="mb-3">Trip Ticketing Rules</h5>

                      <div id="trip-rules-container">
                        {tripRules.map((rule) => (
                          <div className="capacity-grid align-items-center mb-2" key={rule.id}>
                            <select className="form-select" value={rule.ruleType} onChange={(e) => updateTripRule(rule.id, "ruleType", e.target.value)}>
                              <option>Void</option>
                              <option>Refund</option>
                              <option>Reissue</option>
                              <option>No Show</option>
                            </select>

                            <select className="form-select" name="rulename" value={rule.ruleName} onChange={(e) => updateTripRule(rule.id, "ruleName", e.target.value)}>
                              <option>Select Rule</option>
                              <option>Rule1</option>
                              <option>Rule2</option>
                              <option>Rule3</option>
                            </select>

                            <button type="button" className="btn btn-sm btn-danger remove-trip-rule" onClick={() => removeTripRule(rule.id)}>Remove</button>
                          </div>
                        ))}
                      </div>

                      <button type="button" id="addTripRuleLine" className="btn btn-outline-secondary btn-sm mt-2" onClick={addTripRule}>Add Line</button>

                      <div className="d-flex justify-content-end mt-3">
                        <button type="button" className="btn btn-success" onClick={onSaveTrip}>Save Trip</button>
                      </div>
                    </div>
                  </div>

                  {/* (end content) */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
