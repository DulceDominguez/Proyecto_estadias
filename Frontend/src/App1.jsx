import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login/Login';
import Inicio from './pages/Inicio/Inicio';
import Citas from './pages/Citas/Citas';
import EditarCita from './pages/Citas/EditarCita'
import DetallePaciente from './pages/Pacientes/DetallePaciente';
import NuevaCita from './pages/Citas/NuevaCita';
import Calendario from './pages/Calendario/Calendario';
import Pacientes from './pages/Pacientes/Pacientes';
import LogOut from './pages/LogOut/LogOut';


export default function App() {
    return (
        <BrowserRouter>
            {/* El Navbar se coloca fuera de las rutas para que siempre esté visible */}
            <Navbar />

            {/* El main contendrá la pantalla que cambiará dinámicamente */}
            <main style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/citas" element={<Citas />} />
                    <Route path="/nueva-cita" element={<NuevaCita />} />
                    <Route path='/editar-cita' element={<EditarCita />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/detalle-paciente" element={<DetallePaciente />} />
                    <Route path='/logout' element={<LogOut />} />
                </Routes>
            </main>




        </BrowserRouter>
    );
}