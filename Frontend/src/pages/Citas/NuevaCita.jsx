import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Citas.css";
import AlertExito from '../Registro/AlertaExito';

function NuevaCita() {
  const navigate = useNavigate();

  // Estados del formulario
  const [alertaExito, setAlertaExito] = useState(false);
  const [pacienteId, setPacienteId] = useState("");
  const [odontologoId, setOdontologoId] = useState("");
  const [tratamientoId, setTratamientoId] = useState("");

  // Fecha actual por defecto
  const [fecha, setFecha] = useState("2026-10-20");
  const [hora, setHora] = useState("");
  const [estatus, setEstatus] = useState("Pendiente");
  const [notas, setNotas] = useState("");
  const [duracion, setDuracion] = useState("30"); // En minutos

  // Listas dinámicas que vienen de la BD
  const [pacientesBD, setPacientesBD] = useState([]);
  const [odontologosBD, setOdontologosBD] = useState([]);
  const [tratamientosBD, setTratamientosBD] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // NUEVO ESTADO: Para guardar el mensaje de aviso cuando el día no labora
  const [mensajeFechaCerrada, setMensajeFechaCerrada] = useState("");

  // Función auxiliar para calcular hora fin
  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    if (!horaInicio || !duracionMinutos) return "";
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const totalMinutos = (horas * 60) + minutos + parseInt(duracionMinutos);
    const nuevasHoras = Math.floor(totalMinutos / 60) % 24;
    const nuevosMinutos = totalMinutos % 60;
    return `${String(nuevasHoras).padStart(2, "0")}:${String(nuevosMinutos).padStart(2, "0")}`;
  };

  const horaFin = calcularHoraFin(hora, duracion);

  // Función auxiliar para pasar "HH:MM" a minutos totales
  const convertirAMinutos = (horaStr) => {
    if (!horaStr) return 0;
    const [h, m] = horaStr.split(":").map(Number);
    return (h * 60) + m;
  };

  // 1. Cargar datos iniciales fijos (Pacientes, Odontólogos, Tratamientos)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientesBD(data))
      .catch((err) => console.error("Error cargando pacientes:", err));

    fetch("http://127.0.0.1:8000/odontologos")
      .then((res) => res.json())
      .then((data) => setOdontologosBD(data))
      .catch((err) => console.error("Error cargando odontólogos:", err));

    fetch("http://127.0.0.1:8000/tratamientos")
      .then((res) => res.json())
      .then((data) => setTratamientosBD(data))
      .catch((err) => console.error("Error cargando tratamientos:", err));
  }, []);

  // 2. Efecto dinámico para validar días cerrados (Domingos, Festivos) y calcular horarios
  useEffect(() => {
    if (fecha) {
      const [anio, mes, dia] = fecha.split("-");
      const fechaLocal = new Date(anio, mes - 1, dia);
      const diaSemana = fechaLocal.getDay(); // 0 = Domingo
      const esDomingo = diaSemana === 0;

      // Lista de días festivos (puedes agregar los que necesites)
      const diasFestivos = [
        '2026-12-25',
        '2026-01-01',
        '2026-11-02',
        '2026-11-16',
        '2026-12-31',
        '2027-02-01',
        '2027-02-05',
        '2027-03-21',
        '2027-04-01',
        '2027-04-05',
        '2027-09-16',
        '2027-12-25',
        '2027-01-01',
        '2027-11-02',
        '2027-11-16',
        '2027-12-31'
      ];
      const esFestivo = diasFestivos.includes(fecha);

      // Si es domingo o festivo, mostramos el aviso y bloqueamos las horas
      if (esDomingo || esFestivo) {
        setHorasDisponibles([]);
        setMensajeFechaCerrada("⚠️ No hay citas disponibles: El consultorio permanece cerrado los domingos y días festivos.");
        return;
      } else {
        // Limpiamos el mensaje si el día sí es hábil
        setMensajeFechaCerrada("");
      }

      // Si es un día hábil, consultamos las citas de la BD
      fetch("http://127.0.0.1:8000/citas")
        .then((res) => res.json())
        .then((data) => {
          const citasDelDia = data.filter((cita) => cita.fecha.slice(0, 10) === fecha);

          const horariosOcupados = citasDelDia.map((cita) => ({
            hora_inicio: cita.hora_inicio.slice(0, 5),
            hora_fin: cita.hora_fin.slice(0, 5)
          }));

          // Horario base de la clínica
          const horarioBase = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "16:00", "16:30", "17:00"];

          const esLunes = diaSemana === 1;
          const odontologoEspecialId = "3"; // ID del odontólogo con horario especial los lunes

          const libres = horarioBase.filter((slotInicio) => {
            // REGLA ESPECIAL: Si es lunes, ese odontólogo específico no atiende en la mañana
            if (esLunes && String(odontologoId) === odontologoEspecialId) {
              const horaEnMinutos = convertirAMinutos(slotInicio);
              if (horaEnMinutos < convertirAMinutos("16:00")) {
                return false;
              }
            }

            const slotFin = calcularHoraFin(slotInicio, duracion);
            const inicioMinutos = convertirAMinutos(slotInicio);
            const finMinutos = convertirAMinutos(slotFin);

            // Verificar cruces con otras citas existentes
            const tieneCruce = horariosOcupados.some((cita) => {
              const citaInicioMin = convertirAMinutos(cita.hora_inicio);
              const citaFinMin = convertirAMinutos(cita.hora_fin);
              return inicioMinutos < citaFinMin && finMinutos > citaInicioMin;
            });

            return !tieneCruce;
          });

          setHorasDisponibles(libres);
        })
        .catch((err) => console.error("Error cargando los horarios: ", err));
    }
  }, [fecha, odontologoId, duracion]);

  // 3. Limpiar la hora seleccionada si deja de ser válida
  useEffect(() => {
    if (hora && !horasDisponibles.includes(hora)) {
      setHora("");
    }
  }, [horasDisponibles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mensajeFechaCerrada) {
      alert("No se pueden agendar citas en días cerrados (Domingos o Festivos).");
      return;
    }

    if (!pacienteId || !odontologoId || !tratamientoId || !hora) {
      alert("Por favor completa todos los campos requeridos, incluyendo una hora disponible.");
      return;
    }

    if (!horasDisponibles.includes(hora)) {
      alert("La hora seleccionada ya no está disponible. Por favor elige otra.");
      return;
    }

    const nuevaCita = {
      id_paciente: parseInt(pacienteId),
      id_odontologo: parseInt(odontologoId),
      id_tratamiento: parseInt(tratamientoId),
      fecha: fecha,
      hora_inicio: hora.length === 5 ? `${hora}:00` : hora,
      estatus: estatus,
      notas: notas,
      hora_fin: `${horaFin}:00`
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita),
      });

      const resultado = await response.json();

      if (response.ok) {
        setAlertaExito(true);
      } else {
        alert("Error al agendar: " + (resultado.detail || "Verifica los datos"));
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

          {/* Paciente */}
          <div className="form-field full-width">
            <label>Paciente</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
            >
              <option value="">Selecciona un paciente</option>
              {pacientesBD.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="form-field date full-width">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
            {/* Mensaje dinámico de aviso si el día está cerrado */}
            {mensajeFechaCerrada && (
              <p style={{ color: "#d9534f", fontSize: "13px", marginTop: "5px", fontWeight: "bold" }}>
                {mensajeFechaCerrada}
              </p>
            )}
          </div>

          {/* Odontólogo */}
          <div className="form-field">
            <label>Odontólogo</label>
            <select
              value={odontologoId}
              onChange={(e) => setOdontologoId(e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {odontologosBD.map((o) => (
                <option key={o.id} value={o.id}>{o.nombre}</option>
              ))}
            </select>
          </div>

          {/* Hora de inicio */}
          <div className="form-field">
            <label>Hora de inicio disponible</label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              disabled={Boolean(mensajeFechaCerrada)} // Se deshabilita si el día está cerrado
            >
              <option value="">Selecciona una hora disponible</option>
              {horasDisponibles.length === 0 ? (
                <option disabled>
                  {mensajeFechaCerrada ? "Día no laborable" : "No hay horarios disponibles"}
                </option>
              ) : (
                horasDisponibles.map((h) => (
                  <option key={h} value={h}>{h} (Fin: {calcularHoraFin(h, duracion)})</option>
                ))
              )}
            </select>
          </div>

          {/* Duración */}
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



          {/* Tipo de tratamiento */}
          <div className="form-field">
            <label>Tipo de tratamiento</label>
            <select
              value={tratamientoId}
              onChange={(e) => setTratamientoId(e.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              {tratamientosBD.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
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