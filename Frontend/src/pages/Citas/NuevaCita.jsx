import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Citas.css";
import AlertExito from '../Registro/AlertaExito';


function NuevaCita() {
  const navigate = useNavigate();

  // Estados del formulario (guardando los IDs seleccionados)
  const [alertaExito, setAlertaExito] = useState(false);

  const [pacienteId, setPacienteId] = useState("");
  const [odontologoId, setOdontologoId] = useState("");
  const [tratamientoId, setTratamientoId] = useState("");
  const [fecha, setFecha] = useState("2026-10-20");
  const [hora, setHora] = useState("10:00");
  const [estatus, setEstatus] = useState("Pendiente");
  const [notas, setNotas] = useState("");
  const [duracion, setDuracion] = useState("30"); // <-- NUEVO ESTADO (En minutos)

  // Listas dinámicas que vienen de la BD
  const [pacientesBD, setPacientesBD] = useState([]);
  const [odontologosBD, setOdontologosBD] = useState([]);
  const [tratamientosBD, setTratamientosBD] = useState([]);

  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    if (!horaInicio || !duracionMinutos) return "";
    const [horas, minutos] = horaInicio.split(":").map(Number);

    const totalMinutos = (horas * 60) + minutos + parseInt(duracionMinutos);

    const nuevasHoras = Math.floor(totalMinutos / 60) % 24;
    const nuevosMinutos = totalMinutos % 60;

    return `${String(nuevasHoras).padStart(2, "0")}:${String(nuevosMinutos).padStart(2, "0")}`;
  };

  // Variable que guarda el resultado en tiempo real
  const horaFin = calcularHoraFin(hora, duracion);

  // Cargar datos iniciales para los selectores al abrir la vista
  useEffect(() => {
    // Cargar Pacientes
    fetch("http://127.0.0.1:8000/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientesBD(data))
      .catch((err) => console.error("Error cargando pacientes:", err));

    // Cargar Odontólogos
    fetch("http://127.0.0.1:8000/odontologos")
      .then((res) => res.json())
      .then((data) => setOdontologosBD(data))
      .catch((err) => console.error("Error cargando odontólogos:", err));

    // Cargar Tratamientos
    fetch("http://127.0.0.1:8000/tratamientos")
      .then((res) => res.json())
      .then((data) => setTratamientosBD(data))
      .catch((err) => console.error("Error cargando tratamientos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pacienteId || !odontologoId || !tratamientoId) {
      alert("Por favor selecciona paciente, odontólogo y tratamiento.");
      return;
    }

    const nuevaCita = {
      id_paciente: parseInt(pacienteId),
      id_odontologo: parseInt(odontologoId),
      id_tratamiento: parseInt(tratamientoId),
      fecha: fecha,
      hora_inicio: hora.length === 5 ? `${hora}:00` : hora, // Asegurar formato HH:MM:SS
      estatus: estatus,
      notas: notas,
      hora_fin: `${horaFin}:00`
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCita),
      });

      const resultado = await response.json();

      if (response.ok) {
        setAlertaExito(true);

      } else {
        alert(
          "Error al agendar: " + (resultado.detail || "Verifica los datos"),
        );
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="citas-container-new">
      <div className="form-card">
        <h3 className="form-title">Nueva Cita</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Campo Paciente dinámico */}
          <div className="form-field full-width">
            <label>Paciente</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
            >
              <option value="">Selecciona un paciente</option>
              {pacientesBD.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="form-field date">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Hora inicio</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Duración</label>
            <select
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)} // <-- Cambiado a setDuracion
              required
            >
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora y media</option>
              <option value="120">2 horas</option>
            </select>
          </div>
          {/* Tipo de tratamiento dinámico */}
          <div className="form-field">
            <label>Tipo de tratamiento</label>
            <select
              value={tratamientoId}
              onChange={(e) => setTratamientoId(e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {tratamientosBD.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Odontólogo dinámico */}
          <div className="form-field">
            <label>Odontólogo</label>
            <select
              value={odontologoId}
              onChange={(e) => setOdontologoId(e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {odontologosBD.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div className="form-field full-width">
            <label>Notas</label>
            <textarea
              rows="4"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            ></textarea>
          </div>

          {/* Botones */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate("/citas")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
            <AlertExito
              isOpen={alertaExito}
              mensaje="La cita se ha registrado exitosamente en el sistema"
              onClose={() => {
                setAlertaExito(false);
                navigate("/citas");

              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaCita;
