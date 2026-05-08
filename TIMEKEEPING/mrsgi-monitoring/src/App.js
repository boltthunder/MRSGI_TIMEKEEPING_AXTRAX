import React, { useEffect, useState } from "react";
import axios from "axios";
import { startSignalR } from "./class/signalr";
import PlsConnect from "./class/connection";
import { TableData } from "./class/ViewData";
import { isElectron } from "./services/electronService";
import IpPortModal from "./Component/SetupModal";

const App = () => {
  const [lastUser, setLastUser] = useState({});
  const [logs, setLogs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [time, setTime] = useState("");
  const [empID, setEmpID] = useState("");
  const [lastname, setLastname] = useState("");
  //const [installed, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // ================= INITIAL LOAD =================
  const loadInitial = async () => {
    try {
      const res = await axios.get(`${PlsConnect()}/api/View/Get/TodayTaps`);

      const mapped = res.data.map((item) => {
        const [date = "", time = ""] = (item.dtEventReal || "").split("T");

        return {
          readerOut: !!item.bReaderOut,
          time,
          date,
          status: item.iEventType,
          firstName: item.tFirstName || "",
          lastName: item.tLastName || "",
        };
      });

      // setTableData(mapped);
      setLogs(mapped);
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  // ================= CLOCK =================
  const updateClock = () => {
    const now = new Date();

    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour12: true,
    });

    const formattedDate = now
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    setTime(`${formattedDate} ${formattedTime}`);
  };

  // ================= INITIAL EFFECT =================
  useEffect(() => {
    loadInitial();
    updateClock();

    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // ================= SIGNALR =================
  useEffect(() => {
    let connection;

    const connect = async () => {
      connection = await startSignalR();
      // ✅ KEEP THIS (but FIXED)
      connection.on("ReceiveAttendance", (response) => {
        const sanitized = response.map((item) => {
          const [date = "", time = ""] = (item.dtEventReal || "").split("T");
          return {
            readerOut: !!item.bReaderOut,
            time,
            date,
            status: item.iEventType,
            firstName: item.tFirstName || "",
            lastName: item.tLastName || "",
          };
        });
        setLogs(sanitized);
        // ❌ FIX: sanitized is array → use first item
        if (sanitized.length > 0) {
          setEmpID(sanitized[0].lastName);
          setLastname(sanitized[0].firstName);
        }
      });

      // ✅ REAL-TIME (FIXED: APPEND ONLY)
      connection.on("ReceiveLastTap", async (tap) => {
        if (!tap) return;

        const [date = "", time = ""] = (tap.dtEventReal || "").split("T");

        const mappedTap = {
          readerOut: !!tap.bReaderOut,
          time,
          date,
          status: tap.iEventType,
          firstName: tap.tFirstName || "",
          lastName: tap.tLastName || "",
        };

        // ✅ Update header
        setLastUser(mappedTap);
        setEmpID(mappedTap.lastName);
        setLastname(mappedTap.firstName);

        const data = await TableData();

        const sanitized = data.records.map((item) => {
          return {
            time: item.time,
            date: item.date,
            status: item.status,
            type: item.type,
          };
        });
        setTableData(sanitized);

        setLogs((prev) => {
          const exists = prev.some(
            (item) =>
              item.time === mappedTap.time &&
              item.date === mappedTap.date &&
              item.firstName === mappedTap.firstName &&
              item.lastName === mappedTap.lastName,
          );

          if (exists) return prev;

          return [mappedTap, ...prev].slice(0, 50);
        });
      });
    };

    connect();

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  useEffect(() => {
    Setup();
  }, []);

  const Setup = async () => {
    //if (!isElectron()) return; // 🚫 SKIP WEB
    // console.log(isElectron());
    if (isElectron() === false) {
      setShowModal(true); // Show modal in web for testing
      return;
    } else {
      const data = await window.api.getConnections();
      if (data.length === 0) {
        setShowModal(true); // Show modal if no connections found
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveConnection = async (ipAddress, port) => {
    if (isElectron() === false) {
      localStorage.setItem("ipAddress", ipAddress);
      localStorage.setItem("port", port);
      return
    } else if(isElectron === true) {
      await window.api.insertIPPort(ipAddress, port);
    }
    setShowModal(false);
  };
  // ================= UI =================
  return (
    <>
      <IpPortModal
        show={showModal}
        handleClose={handleModalClose}
        handleSave={handleSaveConnection}
      />
      <div className="container-fluid p-4" style={{ background: "#f5f5f5" }}>
        <div className="d-flex flex-column align-items-center">
          <img
            src="/metro_logo_113x85.png"
            alt="Metro Logo"
            style={{ height: "80px" }}
          />
          <h1 className="text-center mb-3" style={{ color: "#333" }}>
            METRO MONITORING SYSTEM
          </h1>
        </div>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">{empID}</h2>
            <h3 className="fw-bold">{lastname}</h3>
          </div>

          <div className="text-end">
            <h1 className="fw-bold mb-0">{time}</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-bordered mb-0 text-center">
              <thead className="table-secondary">
                <tr>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="fs-4 fw-bold">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td
                      className={
                        row.type === "OUT" ? "text-danger" : "text-success"
                      }
                    >
                      {row.type}
                    </td>
                    <td>{row.time}</td>
                    <td>{row.date}</td>
                    <td className="text-success fw-bold">
                      {row.status === 17 ? "GRANTED" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOGS */}
        <div
          className="mt-3 p-2 border bg-white"
          style={{ height: "200px", overflowY: "auto", fontSize: "14px" }}
        >
          {logs.map((log, index) => (
            <div key={index}>
              <span>{log.lastName} </span>
              <span>{log.firstName} </span>
              <span className="fw-bold">{log.time} </span>
              <span className="text-success fw-bold">
                {log.status === 17 ? "GRANTED" : ""}
              </span>
              <span className="fw-bold">{log.readerOut ? " OUT" : " IN"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed-bottom text-dark text-center p-3 shadow">
        <p className="power">POWERED BY: S25-MIS</p>
      </div>
    </>
  );
};

export default App;
