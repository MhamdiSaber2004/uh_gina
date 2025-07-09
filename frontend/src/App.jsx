import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Registre from './pages/Registre';
import ClientLayout from './components/ClientLayout';
import ClientAddCommand from './pages/ClientAddCommand';
import ClientAllCommandes from './pages/ClientAllCommandes';
import ClientProfile from './pages/ClientProfile'; 
import LivreurLayout from './components/LivreurLayout';
import LivreurAllCommandes from './pages/LivreurAllComandes';
import LivreurProfile from './pages/LivreurProfile';
import AdminLayout from './components/AdminLayout';
import AdminAllClients from './pages/AdminClient';
import AdminLivreur from './pages/AdminLivreurs';
import AdminCommandes from './pages/AdminCommandes';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registre" element={<Registre />} />
        </Route>
        <Route path='/client' element={<ClientLayout />}>
          <Route index element={<ClientAllCommandes />} />
          <Route path="command" element={<ClientAddCommand />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>
        <Route path='/livreur' element={<LivreurLayout />}>
          <Route index element={<LivreurAllCommandes />} />
          <Route path='profile' element={<LivreurProfile />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminCommandes />} />
          <Route path='livreurs' element={<AdminLivreur />} />
          <Route path="clients" element={<AdminAllClients />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;