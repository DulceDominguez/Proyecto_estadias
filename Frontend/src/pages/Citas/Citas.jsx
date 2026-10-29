import React, { useState, useEffect } from "react";
import "./Citas.css";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function Citas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const filtro = searchParams.get("filtro"); // Detecta si viene ?filtro=hoy o ?filtro=pendientes

  const [citasDelDia, setCitasDelDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tituloSeccion, setTituloSeccion] = useState(
    "Aquí tienes todas las citas registradas",
  );

  // Función para traer las citas del backend y aplicar filtros según la URL
  const obtenerCitas = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/citas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const hoyStr = new Date().toISOString().split("T")[0];

          if (filtro === "hoy") {
            // Filtrar solo las citas de hoy
            const filtradas = data.filter((c) => c.fecha === hoyStr);
            setCitasDelDia(filtradas);
            setTituloSeccion("Citas programadas para hoy");
          } else if (filtro === "pendientes") {
            // Filtrar citas pendientes
            const filtradas = data.filter(
              (c) => c.estatus && c.estatus.toLowerCase() === "pendiente",
            );
            setCitasDelDia(filtradas);
            setTituloSeccion("Citas pendientes de atención");
          } else {
            // Mostrar todas
            setCitasDelDia(data);
            setTituloSeccion("Aquí tienes todas las citas registradas");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar las citas:", err);
        setLoading(false);
      });
  };

  // Se ejecuta al cargar la página, cambiar de ubicación o cambiar el filtro en la URL
  useEffect(() => {
    obtenerCitas();
  }, [location, filtro]);

  const handleConfirmar = (cita) => {
    navigate("/editar-cita", { state: { cita } });
  };

  return (
    <div className="citas-container">
      <div className="citas-subsections">
        <h3>{tituloSeccion}</h3>
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
          No hay citas que coincidan con este filtro.
        </p>
      ) : (
        <div className="citas-lista">
          {citasDelDia.map((cita) => (
            <div key={cita.id} className="cita-card">
              <div className="cita-hora">{cita.hora_inicio}-{cita.hora_fin}</div>
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
