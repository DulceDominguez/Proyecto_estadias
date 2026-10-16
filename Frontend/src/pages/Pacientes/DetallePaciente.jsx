import React, { useState, useEffect } from "react";
import "./DetallePaciente.css";
import { useNavigate } from 'react-router-dom';


function DetallePaciente({

    paciente,
    onVolver,
    onGuardarPaciente,
    onEliminarPaciente,
}) {
    const navigate = useNavigate();

    const [tabActiva, setTabActiva] = useState("citas");
    // Estado para controlar el modo edición
    const [isEditing, setIsEditing] = useState(false);

    // Estado local con datos del paciente
    const [datosPaciente, setDatosPaciente] = useState({
        id: paciente?.id || null,
        nombre: paciente?.nombre || "",
        telefono: paciente?.telefono || "",
        edad: paciente?.edad || "",
        citas: paciente?.citas || [],
        citasCanceladas: paciente?.citasCanceladas || [],
        notas: paciente?.notas || [],
    });

    // Si llega un paciente por props, actualizamos el estado
    useEffect(() => {
        if (paciente) {
            setDatosPaciente({
                id: paciente.id,
                nombre: paciente.nombre || "",
                telefono: paciente.telefono || "",
                edad: paciente.edad || "",
                citas: paciente.citas || [],
                citasCanceladas: paciente.citasCanceladas || [],
                notas: paciente.notas || [],
            });
        }
    }, [paciente]);

    // Manejador para los inputs de edición
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosPaciente((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Guardar cambios
    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        if (onGuardarPaciente) {
            onGuardarPaciente(datosPaciente);
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        if (paciente) {
            setDatosPaciente({
                id: paciente.id,
                nombre: paciente.nombre || "",
                telefono: paciente.telefono || "",
                edad: paciente.edad || "",
                citas: paciente.citas || [],
                citasCanceladas: paciente.citasCanceladas || [],
                notas: paciente.notas || [],
            });
        }
        setIsEditing(false);
    };

    // Función para confirmar y eliminar paciente
    const handleEliminar = () => {
        const confirmar = window.confirm(
            `¿Estás segura de que deseas eliminar al paciente "${datosPaciente.nombre}"?`,
        );
        if (confirmar) {
            if (onEliminarPaciente) {
                onEliminarPaciente(datosPaciente.id);
            } else if (onVolver) {
                onVolver(); // Si no mandas la función de eliminar, regresa a la lista
            }
        }
    };



    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            {/* Header superior del módulo */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <button className="btn_volver"
                    onClick={() => navigate('/pacientes')}
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #ccc",
                        padding: "8px 18px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    ← Volver a lista
                </button>
            </div>

            {/* Recuadro de información con Editar y Eliminar */}
            <div className="dp-card-info">
                {isEditing ? (
                    /* MODO EDICIÓN */
                    <form
                        onSubmit={handleSave}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "15px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            className="dp-avatar-section"
                            style={{ flex: 1, minWidth: "280px" }}
                        >
                            <div className="dp-avatar-circle">👤</div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    width: "100%",
                                }}
                            >
                                <input
                                    type="text"
                                    name="nombre"
                                    value={datosPaciente.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre completo"
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        fontSize: "14px",
                                    }}
                                    required
                                />
                                <input
                                    type="text"
                                    name="telefono"
                                    value={datosPaciente.telefono}
                                    onChange={handleInputChange}
                                    placeholder="Número telefónico"
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        fontSize: "14px",
                                    }}
                                    required
                                />
                                <input
                                    type="text"
                                    name="edad"
                                    value={datosPaciente.edad}
                                    onChange={handleInputChange}
                                    placeholder="Edad (ej. 25 años)"
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        fontSize: "14px",
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: "#e2e8f0",
                                    color: "#475569",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="dp-btn-editar">
                                Guardar
                            </button>
                        </div>
                    </form>
                ) : (
                    /* MODO LECTURA NORMAL */
                    <>
                        <div className="dp-avatar-section">
                            <div className="dp-avatar-circle">👤</div>
                            <div>
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        margin: "0 0 6px 0",
                                    }}
                                >
                                    {datosPaciente.nombre || "Sin nombre registrado"}
                                </h3>
                                <p style={{ margin: "3px 0", fontSize: "14px", color: "#444" }}>
                                    📞 {datosPaciente.telefono || "Sin teléfono"}
                                </p>
                                <p style={{ margin: "3px 0", fontSize: "14px", color: "#444" }}>
                                    🎂 {datosPaciente.edad || "Sin edad registrada"}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                                className="dp-btn-editar"
                                onClick={() => setIsEditing(true)}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={handleEliminar}
                                style={{
                                    backgroundColor: "#fee2e2",
                                    color: "#dc2626",
                                    border: "1px solid #fca5a5",
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Pestañas: Citas, Citas canceladas, Notas */}
            <div className="dp-tabs-container">
                <button
                    className={`dp-tab-btn ${tabActiva === "citas" ? "active" : ""}`}
                    onClick={() => setTabActiva("citas")}
                >
                    Citas
                </button>
                <button
                    className={`dp-tab-btn ${tabActiva === "canceladas" ? "active" : ""}`}
                    onClick={() => setTabActiva("canceladas")}
                >
                    Citas canceladas
                </button>
                <button
                    className={`dp-tab-btn ${tabActiva === "notas" ? "active" : ""}`}
                    onClick={() => setTabActiva("notas")}
                >
                    Notas
                </button>
            </div>

            {/* Contenido de Citas */}
            {tabActiva === "citas" && (
                <div className="dp-lista-citas">
                    {datosPaciente.citas && datosPaciente.citas.length > 0 ? (
                        datosPaciente.citas.map((cita, index) => (
                            <div className="dp-item-cita" key={index}>
                                <span>{cita.fecha}</span>
                                <span>{cita.hora}</span>
                                <span>{cita.servicio || cita.motivo}</span>
                                <span className={`dp-badge ${cita.estado?.toLowerCase()}`}>
                                    {cita.estado}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "30px", color: "#777" }}
                        >
                            No hay citas registradas para este paciente.
                        </div>
                    )}
                </div>
            )}

            {/* Contenido de Citas Canceladas */}
            {tabActiva === "canceladas" && (
                <div className="dp-lista-citas">
                    {datosPaciente.citasCanceladas &&
                        datosPaciente.citasCanceladas.length > 0 ? (
                        datosPaciente.citasCanceladas.map((cita, index) => (
                            <div className="dp-item-cita" key={index}>
                                <span>{cita.fecha}</span>
                                <span>{cita.hora}</span>
                                <span>{cita.servicio || cita.motivo}</span>
                            </div>
                        ))
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "30px", color: "#777" }}
                        >
                            No hay citas canceladas.
                        </div>
                    )}
                </div>
            )}

            {/* Contenido de Notas */}
            {tabActiva === "notas" && (
                <div style={{ padding: "10px" }}>
                    {datosPaciente.notas && datosPaciente.notas.length > 0 ? (
                        datosPaciente.notas.map((nota, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "10px",
                                }}
                            >
                                <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
                                    {nota.texto || nota}
                                </p>
                                {nota.fecha && (
                                    <small style={{ color: "#94a3b8", fontSize: "12px" }}>
                                        {nota.fecha}
                                    </small>
                                )}
                            </div>
                        ))
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "30px", color: "#777" }}
                        >
                            No hay notas registradas.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DetallePaciente;
