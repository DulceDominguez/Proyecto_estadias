import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Citas.css";
import AlertExito from "../Registro/AlertaExito";

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

    const totalMinutosInicio = hInicio * 60 + mInicio;
    const totalMinutosFin = hFin * 60 + mFin;
    const diferencia = totalMinutosFin - totalMinutosInicio;

    return diferencia > 0 ? diferencia.toString() : "30";
  };

  // Estados con los valores iniciales de la cita
  const [paciente, setPaciente] = useState(citaAEditar.paciente || "");
  const [fecha, setFecha] = useState(
    citaAEditar.fecha ? citaAEditar.fecha.slice(0, 10) : "2026-10-20"
  );
  const [hora, setHora] = useState(
    citaAEditar.hora_inicio ? citaAEditar.hora_inicio.slice(0, 5) : "10:00"
  );

  // Controla la carga inicial para no borrar la hora al entrar a editar
  const [esCargaInicial, setEsCargaInicial] = useState(true);

  // 2. Duración inicial calculada desde hora_inicio y hora_fin
  const [duracion, setDuracion] = useState(() =>
    calcularDuracionEnMinutos(citaAEditar.hora_inicio, citaAEditar.hora_fin)
  );

  const [tratamientoId, setTratamientoId] = useState(
    citaAEditar.tratamiento_id ?? citaAEditar.id_tratamiento ?? ""
  );
  const [odontologoId, setOdontologoId] = useState(
    citaAEditar.odontologo_id ?? citaAEditar.id_odontologo ?? ""
  );
  const [estatus, setEstatus] = useState(citaAEditar.estatus || "Pendiente");
  const [notas, setNotas] = useState(citaAEditar.notas || "");

  // Listas para los dropdowns
  const [odontologosBD, setOdontologosBD] = useState([]);
  const [tratamientosBD, setTratamientosBD] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  const [mensajeFechaCerrada, setMensajeFechaCerrada] = useState("");

  // Función auxiliar para calcular hora fin (formato HH:MM)
  const calcularHoraFin = (horaInicio, duracionMinutos) => {
    if (!horaInicio || !duracionMinutos) return "";
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const totalMinutos = horas * 60 + minutos + parseInt(duracionMinutos, 10);
    const nuevasHoras = Math.floor(totalMinutos / 60) % 24;
    const nuevosMinutos = totalMinutos % 60;
    return `${String(nuevasHoras).padStart(2, "0")}:${String(
      nuevosMinutos
    ).padStart(2, "0")}`;
  };

  // Función auxiliar para pasar "HH:MM" a minutos totales
  const convertirAMinutos = (horaStr) => {
    if (!horaStr) return 0;
    const [h, m] = horaStr.split(":").map(Number);
    return h * 60 + m;
  };

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

  useEffect(() => {
    if (fecha) {
      const [anio, mes, dia] = fecha.split("-").map(Number);
      const fechaLocal = new Date(anio, mes - 1, dia);
      const diaSemana = fechaLocal.getDay(); // 0 = Domingo
      const esDomingo = diaSemana === 0;

      // Lista de días festivos
      const diasFestivos = [
        "2026-12-25",
        "2026-01-01",
        "2026-11-02",
        "2026-11-16",
        "2026-12-31",
        "2027-02-01",
        "2027-02-05",
        "2027-03-21",
        "2027-04-01",
        "2027-04-05",
        "2027-09-16",
        "2027-12-25",
        "2027-01-01",
        "2027-11-02",
        "2027-11-16",
        "2027-12-31",
      ];
      const esFestivo = diasFestivos.includes(fecha);

      // Si es domingo o festivo, mostramos el aviso y bloqueamos las horas
      if (esDomingo || esFestivo) {
        setHorasDisponibles([]);
        setMensajeFechaCerrada(
          "⚠️ No hay citas disponibles: El consultorio permanece cerrado los domingos y días festivos."
        );
        return;
      } else {
        setMensajeFechaCerrada("");
      }

      // Si es un día hábil, consultamos las citas de la BD
      fetch("http://127.0.0.1:8000/citas")
        .then((res) => res.json())
        .then((data) => {
          // Excluir la cita actual y filtrar por fecha (y odontólogo si está seleccionado)
          const citasDelDia = data.filter((cita) => {
            const mismaFecha = cita.fecha.slice(0, 10) === fecha;
            const noEsLaMismaCita = cita.id !== citaAEditar.id;
            const citaOdontologoId = cita.odontologo_id ?? cita.id_odontologo;
            const mismoOdontologo =
              !odontologoId || String(citaOdontologoId) === String(odontologoId);

            return mismaFecha && noEsLaMismaCita && mismoOdontologo;
          });

          const horariosOcupados = citasDelDia.map((cita) => ({
            hora_inicio: cita.hora_inicio.slice(0, 5),
            hora_fin: cita.hora_fin.slice(0, 5),
          }));

          // Horario base de la clínica
          const horarioBase = [
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
          ];

          const esLunes = diaSemana === 1;
          const odontologoEspecialId = "3";

          const libres = horarioBase.filter((slotInicio) => {
            // REGLA ESPECIAL: Si es lunes, la odontóloga Nora no atiende antes de las 4 pm
            if (esLunes && String(odontologoId) === odontologoEspecialId) {
              const horaEnMinutos = convertirAMinutos(slotInicio);
              if (horaEnMinutos < convertirAMinutos("16:00")) {
                return false;
              }
            }

            const slotFin = calcularHoraFin(slotInicio, duracion);
            const inicioMinutos = convertirAMinutos(slotInicio);
            const finMinutos = convertirAMinutos(slotFin);

            // Verificar que no se cruce con otro horario existente
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
  }, [fecha, odontologoId, duracion, citaAEditar.id]);

  // 3. Conserva la hora inicial al entrar y la limpia solo si el usuario cambia y ya no está disponible
  useEffect(() => {
    if (esCargaInicial) {
      if (horasDisponibles.length > 0) {
        setEsCargaInicial(false);
      }
      return;
    }

    if (hora && !horasDisponibles.includes(hora)) {
      setHora("");
    }
  }, [horasDisponibles, esCargaInicial, hora]);

  // Asegura que la hora actual siga visible como opción si se está editando
  const opcionesHora =
    hora && !horasDisponibles.includes(hora)
      ? [hora, ...horasDisponibles]
      : horasDisponibles;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const horaInicioFormateada = hora.length === 5 ? `${hora}:00` : hora;
    const horaFinCorta = calcularHoraFin(hora, duracion);
    const horaFinFormateada = `${horaFinCorta}:00`;

    const citaActualizada = {
      id_odontologo: parseInt(odontologoId, 10),
      id_tratamiento: parseInt(tratamientoId, 10),
      fecha: fecha,
      hora_inicio: horaInicioFormateada,
      estatus: estatus,
      notas: notas,
      hora_fin: horaFinFormateada,
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
        }
      );

      const resultado = await response.json();

      if (response.ok) {
        setAlertaExito(true);
      } else {
        alert(
          "Error al actualizar: " + (resultado.detail || "Error desconocido")
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

            {/* Hora de inicio */}
            <div className="form-field">
              <label>Hora de inicio disponible</label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                disabled={Boolean(mensajeFechaCerrada)}
              >
                <option value="">Selecciona una hora disponible</option>
                {opcionesHora.length === 0 ? (
                  <option disabled>
                    {mensajeFechaCerrada
                      ? "Día no laborable"
                      : "No hay horarios disponibles"}
                  </option>
                ) : (
                  opcionesHora.map((h) => (
                    <option key={h} value={h}>
                      {h} (Fin: {calcularHoraFin(h, duracion)})
                    </option>
                  ))
                )}
              </select>
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

          {mensajeFechaCerrada && (
            <div className="form-field full-width">
              <p className="mensaje-aviso">{mensajeFechaCerrada}</p>
            </div>
          )}

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
              mensaje="La cita se actualizó exitosamente en el sistema"
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