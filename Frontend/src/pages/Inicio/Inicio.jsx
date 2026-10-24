import React, { useState, useEffect } from 'react';

import "./Inicio.css";
import { Link } from "react-router-dom";
import Agenda from "../../assets/inicio_agenda.png";
import Pacientes from "../../assets/inicio_paciente.png";
import Citas_Pendientes from "../../assets/inicio_pendientes.png";
import { User } from "lucide-react";
import { useNavigate } from 'react-router-dom';



export default function Inicio() {
  const [citasTotales, setCitasTotales] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [citasPendientes, setCitasPendientes] = useState(0);
  const [proximasCitas, setProximasCitas] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login")
    }
    const cargarResumenHoy = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const resCitas = await fetch("http://localhost:8000/citas", { headers });
        if (resCitas.ok) {
          const dataCitas = await resCitas.json();

          const fechaLocal = new Date();
          const anio = fechaLocal.getFullYear();
          const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
          const dia = String(fechaLocal.getDate()).padStart(2, '0');
          const hoy = `${anio}-${mes}-${dia}`;


          const citasDeHoy = dataCitas.filter(c => c.fecha === hoy);

          setCitasTotales(citasDeHoy.length);

          const pacientesUnicosHoy = new Set(
            citasDeHoy.map(c => c.paciente_id).filter(id => id !== undefined && id !== null)
          );
          setTotalPacientes(pacientesUnicosHoy.size);

          const pendientesHoy = citasDeHoy.filter(
            c => c.estatus && c.estatus.toLowerCase() === "pendiente"
          );
          setCitasPendientes(pendientesHoy.length);

          setProximasCitas(citasDeHoy.slice(0, 3));
        }
      } catch (error) {
        console.error("Error al cargar el resumen de hoy:", error);
      }
    };

    cargarResumenHoy();
  }, []);

  return (
    <div className="contenedor_inicio">
      <div className="encabezados">
        <p className="titulo">Bienvenida Dra. Nora</p>
        <p className="subtitulo">Aquí tienes un resumen de hoy </p>
      </div>

      <div className="dashboard">
        <div>
          <img src={Agenda} className="agenda_img" />
          <b>
            <p>{citasTotales} </p>
          </b>
          <p>Citas totales</p>
        </div>
        <div>
          <img src={Pacientes} />
          <b>
            <p> {totalPacientes} </p>
          </b>
          <p>Pacientes</p>
        </div>
        <div>
          <img src={Citas_Pendientes} />
          <b>
            <p>{citasPendientes} </p>
          </b>
          <p className="text_pendientes">Citas pendientes</p>
        </div>
      </div>

      <div className="descripcion">
        <p>Proximas citas</p>
        <Link to="/citas">Ver todo</Link>
      </div>


      {proximasCitas.length === 0 ? (
        <p>No hay citas programadas para hoy.</p>
      ) : (
        proximasCitas.map((cita) => (
          <div className="citas-lista">
            <div key={cita.id} className="cita-card">
              <div className="cita-hora">{cita.hora_inicio}</div>
              <div className="cita-info">
                <span className="cita-paciente">{cita.paciente}</span>
                <span className="cita-tratamiento">
                  {cita.tratamiento} - <small>{cita.odontologo}</small>
                </span>
              </div>
              <div className="cita_acciones">
                <div
                  className={`cita-estatus ${cita.estatus ? cita.estatus.toLowerCase() : "pendiente"}`}
                >
                  {cita.estatus}
                </div>

              </div>
            </div>
          </div>
        ))
      )}

    </div>
  );
}
