import React, { useState, useEffect } from "react";
import "./Citas.css";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function Citas() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const filtro = searchParams.get("filtro"); // Detecta si viene ?filtro=hoy o ?filtro=pendientes

    const [Usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tituloSeccion, setTituloSeccion] = useState(
        "Aquí tienes todas las citas registradas",
    );

    // Función para traer las citas del backend y aplicar filtros según la URL
    const obtenerUsuarios = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/registro")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsuarios(data);

                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar los usuarios:", err);
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
                    + Agregar usuario
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Cargando usuarios...
                </p>
            ) : Usuarios.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    No hay usuarios.
                </p>
            ) : (
                <div className="citas-lista usuarios-lista">
                    {Usuarios.map((Usuario) => (
                        <div key={Usuario.id} className="cita-card">
                            <div className="cita-hora">{Usuario.nombre}</div>
                            <div className="cita-info">
                                <span className="cita-paciente">{Usuario.correo}</span>

                            </div>

                            <button
                                className="btn-editar"
                                onClick={() => handleConfirmar(cita)}
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Citas;
