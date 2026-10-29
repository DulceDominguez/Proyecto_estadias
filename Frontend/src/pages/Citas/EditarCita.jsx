import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Citas.css";
import AlertExito from '../Registro/AlertaExito';


function EditarCita() {
  const location = useLocation();
  const navigate = useNavigate();
  const citaAEditar = location.state?.cita || {};
  const [alertaExito, setAlertaExito] = useState(false);


  // 1. Declaramos la función PRIMERO para que exista antes de usarse
  const calcularDuracionEnMinutos = (horaInicioBD, horaFinBD) => {
    if (!horaInicioBD || !horaFinBD) return "30";

    const [hInicio, mInicio] = horaInicioBD.split(":").map(Number);
    const [hFin, mFin] = horaFinBD.split(":").map(Number);

    const totalMinutosInicio = (hInicio * 60) + mInicio;
    const totalMinutosFin = (hFin * 60) + mFin;
    const diferencia = totalMinutosFin - totalMinutosInicio;

    return diferencia.toString();
  };

  // Estados con los valores iniciales de la cita
  const [paciente, setPaciente] = useState(citaAEditar.paciente || "");
  const [fecha, setFecha] = useState(citaAEditar.fecha || "2026-10-20");
  const [hora, setHora] = useState(citaAEditar.hora_inicio ? citaAEditar.hora_inicio.slice(0, 5) : "10:00");

  // 2. Usamos la función directamente como valor inicial del estado (¡Adiós al setDuracion suelto!)
  const [duracion, setDuracion] = useState(() =>
    calcularDuracionEnMinutos(citaAEditar.hora_inicio, citaAEditar.hora_fin)
  );

  const [tratamientoId, setTratamientoId] = useState(
    citaAEditar.tratamiento_id || "",
  );
  const [odontologoId, setOdontologoId] = useState(
    citaAEditar.odontologo_id || "",
  );
  const [estatus, setEstatus] = useState(citaAEditar.estatus || "Pendiente");
  const [notas, setNotas] = useState(citaAEditar.notas || "");

  // Listas para los dropdowns
  const [odontologosBD, setOdontologosBD] = useState([]);
  const [tratamientosBD, setTratamientosBD] = useState([]);

  useEffect(() => {
    // Cargar Odontólogos de la BD
    fetch("http://127.0.0.1:8000/odontologos")
      .then((res) => res.json())
      .then((data) => setOdontologosBD(data))
      .catch((err) => console.error("Error cargando odontólogos:", err));

    // Cargar Tratamientos de la BD
    fetch("http://127.0.0.1:8000/tratamientos")
      .then((res) => res.json())
      .then((data) => setTratamientosBD(data))
      .catch((err) => console.error("Error cargando tratamientos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nota: aquí corregí 'hora_inicio' y 'hora_fin' para usar la variable 'hora' del estado y calcular lógicamente
    const horaInicioFormateada = hora.length === 5 ? `${hora}:00` : hora;

    // Si quieres calcular la hora fin sumando la duración seleccionada (en minutos):
    const [h, m] = hora.split(":").map(Number);
    const fechaBase = new Date();
    fechaBase.setHours(h, m + parseInt(duracion), 0);
    const horaFinFormateada = fechaBase.toTimeString().slice(0, 8); // Formato HH:MM:SS

    const citaActualizada = {
      id_odontologo: parseInt(odontologoId),
      id_tratamiento: parseInt(tratamientoId),
      fecha: fecha,
      hora_inicio: horaInicioFormateada,
      estatus: estatus,
      notas: notas,
      hora_fin: horaFinFormateada
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/citas/${citaAEditar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(citaActualizada),
        },
      );

      const resultado = await response.json();

      if (response.ok) {
        setAlertaExito(true);

      } else {
        alert(
          "Error al actualizar: " + (resultado.detail || "Error desconocido"),
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
        <h3 className="form-title">Editar Cita</h3>
        <form onSubmit={handleSubmit} className="form-grid3">
          {/* Campo Paciente (Solo lectura) */}
          <div className="row">
            <div className="form-field">
              <label>Paciente</label>
              <input type="text" value={paciente} disabled />
            </div>
            {/* Estatus */}
            <div className="form-field select-estatus">
              <label>Estatus</label>
              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value)}
              >
                <option value="Confirmada">Confirmada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="row">
            <div className="form-field">
              <label>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Duración</label>
              <select
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                required
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora y media</option>
                <option value="120">2 horas</option>
              </select>
            </div>
          </div>

          {/* Tipo de tratamiento y Odontólogo dinámicos */}
          <div className="row">
            <div className="form-field">
              <label>Tipo de tratamiento</label>
              <select
                value={tratamientoId}
                onChange={(e) => setTratamientoId(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {tratamientosBD.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Odontólogo</label>
              <select
                value={odontologoId}
                onChange={(e) => setOdontologoId(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {odontologosBD.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nombre}
                  </option>
                ))}
              </select>
            </div>
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
              Guardar Cambios
            </button>
            <AlertExito
              isOpen={alertaExito}
              mensaje="La cita se actualizado exitosamente en el sistema"
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

export default EditarCita;