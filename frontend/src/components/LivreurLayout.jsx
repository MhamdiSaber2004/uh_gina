import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LivreurNavBar from "./LivreurNavBar";

export default function LivreurLayout() {

    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role = user ? JSON.parse(user).role : null;
  
      if (!token || !user || role !== 'livreur') {
        navigate('/login');
      }
    }, [navigate]);

  return (
    <>
        <LivreurNavBar />
        <Outlet />
    </>
  );
}