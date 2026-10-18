import "./Inicio.css";
import { Link } from "react-router-dom";
import Agenda from "../../assets/inicio_agenda.png";
import Pacientes from "../../assets/inicio_paciente.png";
import Citas_Pendientes from "../../assets/inicio_pendientes.png";
import { User } from "lucide-react";

export default function Inicio() {
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
            <p>10</p>
          </b>
          <p>Citas totales</p>
        </div>
        <div>
          <img src={Pacientes} />
          <b>
            <p>10</p>
          </b>
          <p>Pacientes</p>
        </div>
        <div>
          <img src={Citas_Pendientes} />
          <b>
            <p>5</p>
          </b>
          <p className="text_pendientes">Citas pendientes</p>
        </div>
      </div>

      <div className="descripcion">
        <p>Proximas citas</p>
        <Link to="/citas">Ver todo</Link>
      </div>

      <div className="pacientes_agenda">
        <div className="contenedor_rows">
          <div className="rows">
            <div className="info">
              <p>10:00</p>
              <User className="user_info" />
              <p>Ana Lopez Garcia:Limpieza</p>
            </div>
            <div className="estatus">
              <p>Corfirmada</p>
            </div>
          </div>
        </div>
        <div className="contenedor_rows">
          <div className="rows">
            <div className="info">
              <p>10:30</p>
              <User className="user_info" />
              <p>Paola Perez Avila:Extraccion</p>
            </div>

            <div className="estatus">
              <p>Corfirmada</p>
            </div>
          </div>
        </div>
        <div className="contenedor_rows">
          <div className="rows">
            <div className="info">
              <p>11:00</p>
              <User className="user_info" />
              <p>Adriana Rodriguez Delgado:Limpieza</p>
            </div>
            <div className="estatus">
              <p>Corfirmada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
