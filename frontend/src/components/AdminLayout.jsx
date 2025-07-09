import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBart  from "./AdminNavBar";
export default function AdminLayout() {
    const navigate = useNavigate();
    useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : null;

    if (!token || !user || role !== 'admin') {
        navigate('/login');
    }
    }, [navigate]);
  return (
    <>
      <AdminNavBart />
      <Outlet />
    </>
  );
}