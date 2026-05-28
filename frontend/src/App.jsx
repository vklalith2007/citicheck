import { Navigate, Routes, Route, useLocation } from "react-router-dom";
// Remove the import of ScrollRestoration
import CitiSolveLanding from "./guest/guest.jsx";
import CitizenPortal from "./citizenfolder/citizenportal.jsx";
import Complaint from "./citizenfolder/complaint.jsx";
import SubmitComplaint from "./citizenfolder/submitcomplaint.jsx";
import FAQ from "./citizenfolder/faq.jsx";
import UserGuide from "./citizenfolder/userguide.jsx";
import StaffPortal from "./staffolder/staffportal.jsx";
import DepartmentComplaints from "./staffolder/departmentcomplaints.jsx";
import SupportStaff from "./staffolder/supportstaff.jsx";
import UserGuideStaff from "./staffolder/staffuserguide.jsx";
import FaqStaff from "./staffolder/stafffaq.jsx";
import SearchStaff from "./staffolder/staffsearch.jsx";
import { useEffect, useState } from "react";
import AdminLayout from "./admin/adminportal.jsx";

const API = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoleRoute = ({ allowedRole, children }) => {
  const [access, setAccess] = useState('checking');

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await fetch(`${API}/api/auth/is-authenticated`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok && data.success && data.user?.role === allowedRole) {
          setAccess('allowed');
        } else {
          setAccess('denied');
        }
      } catch {
        setAccess('denied');
      }
    };

    verifyAccess();
  }, [allowedRole]);

  if (access === 'checking') {
    return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />;
  }

  return access === 'allowed' ? children : <Navigate to="/" replace />;
};


function App() {
  // Add this hook to listen for location changes
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
    {/* Remove or keep this line commented out: <ScrollRestoration /> */}
    <Routes>
        <Route path="/" element={<CitiSolveLanding />} />
        <Route path="/citizen/home" element={<ProtectedRoleRoute allowedRole="citizen"><CitizenPortal /></ProtectedRoleRoute>} />
        <Route path="/citizen/complaints" element={<ProtectedRoleRoute allowedRole="citizen"><Complaint /></ProtectedRoleRoute>} />
        <Route path="/citizen/submit" element={<ProtectedRoleRoute allowedRole="citizen"><SubmitComplaint /></ProtectedRoleRoute>} />
        <Route path="/citizen/faq" element={<ProtectedRoleRoute allowedRole="citizen"><FAQ /></ProtectedRoleRoute>} />
        <Route path="/citizen/userguide" element={<ProtectedRoleRoute allowedRole="citizen"><UserGuide /></ProtectedRoleRoute>} />
        <Route path="/staff/home" element={<ProtectedRoleRoute allowedRole="staff"><StaffPortal /></ProtectedRoleRoute>} />
        <Route path="/staff/departmentcomplaints" element={<ProtectedRoleRoute allowedRole="staff"><DepartmentComplaints /></ProtectedRoleRoute>} />
        <Route path="/staff/support" element={<ProtectedRoleRoute allowedRole="staff"><SupportStaff /></ProtectedRoleRoute>} />
        <Route path="/staff/userguide" element={<ProtectedRoleRoute allowedRole="staff"><UserGuideStaff /></ProtectedRoleRoute>} />
        <Route path="/staff/faq" element={<ProtectedRoleRoute allowedRole="staff"><FaqStaff /></ProtectedRoleRoute>} />
        <Route path="/staff/search" element={<ProtectedRoleRoute allowedRole="staff"><SearchStaff /></ProtectedRoleRoute>} />
        <Route path="/admin/*" element={<ProtectedRoleRoute allowedRole="admin"><AdminLayout /></ProtectedRoleRoute>} />
    </Routes>
    </>
  )
}

export default App;
