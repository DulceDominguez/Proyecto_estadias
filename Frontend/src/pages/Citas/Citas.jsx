import React, { useState, useEffect } from "react";
import "./Citas.css";
import { useNavigate, useLocation } from "react-router-dom";

function Citas() {
  const navigate = useNavigate();
  const location = useLocation(); // Detecta cuando cambiamos de página
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para traer las citas del backend
  const obtenerCitas = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/citas")
      .then((res) => res.json())
      .then((data) => {
        setCitasDelDia(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar las citas:", err);
        setLoading(false);
      });
  };

  // Se ejecuta al cargar la página y cada vez que regreses a esta vista
  useEffect(() => {
    obtenerCitas();
  }, [location]);

  const handleConfirmar = (cita) => {
    navigate("/editar-cita", { state: { cita } });
  };

  return (
    <div className="citas-container">
      <div className="citas-subsections">
        <h3>Aquí tienes todas las citas registradas</h3>
        <button className="btn-agendar" onClick={() => navigate("/nueva-cita")}>
          + Agendar cita
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Cargando citas...
        </p>
      ) : citasDelDia.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No hay citas registradas todavía.
        </p>
      ) : (
        <div className="citas-lista">
          {citasDelDia.map((cita) => (
            <div key={cita.id} className="cita-card">
              <div className="cita-hora">{cita.hora}</div>
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
                <button
                  className="btn-editar"
                  onClick={() => handleConfirmar(cita)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Citas;
