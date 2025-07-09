import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ClientNavBar from "./clientNavBar";

export default function ClientLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : null;

    if (!token || !user || role !== 'client') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <ClientNavBar />
      <Outlet />
    </>
  );
}
