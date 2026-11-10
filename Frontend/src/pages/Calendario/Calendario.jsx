

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import format from 'date-fns/format';

import parse from 'date-fns/parse';

import startOfWeek from 'date-fns/startOfWeek';

import getDay from 'date-fns/getDay';

import es from 'date-fns/locale/es';

import { useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';


import 'react-big-calendar/lib/css/react-big-calendar.css';

import './Calendario.css';



const locales = {

    'es': es,

};



const localizer = dateFnsLocalizer({

    format,

    parse,

    startOfWeek,

    getDay,

    locales,

});


const EventoPerzonalizado = ({ event, vistaActual }) => {

    if (event.esResumen) {
        return (
            <div style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', color: 'white' }}>
                {event.totalCitas} {event.totalCitas === 1 ? 'cita' : 'citas'}

            </div >
        );
    }

    if (vistaActual === 'day') {
        return (
            <div>
                <strong>{event.paciente}</strong>
                {event.tratamiento && <div>:  {event.tratamiento} </div>}
            </div>
        );
    }


};


const esDiaInabil = (date) => {
    const diaSemana = date.getDay();

    if (diaSemana == 0) return true;

    const fechaStr = format(date, 'yyyy-MM-dd');
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
        '2027-12-31',
    ];

    if (diasFestivos.includes(fechaStr)) return true;

    return false;

};

const dayPropGetter = (date) => {
    if (esDiaInabil(date)) {
        return {
            className: 'dia-inabil',
            style: {
                backgroundColor: '#f1f3f5'
            },
        };
    }
    return {};
};






const Calendario = () => {


    const navigate = useNavigate();

    const [fechaActual, setFechaActual] = useState(new Date());



    // 1. NUEVO: Estado para controlar si estamos en Día, Semana o Mes

    const [vistaActual, setVistaActual] = useState('day');



    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const obtenerCitas = async () => {

            try {

                const token = localStorage.getItem("token");
                const respuesta = await fetch("http://localhost:8000/calendario", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (respuesta.ok) {
                    const datosBackend = await respuesta.json();
                    console.log("Datos del backend:", datosBackend); // 1. Para revisar qué nos manda FastAPI

                    if (datosBackend && Array.isArray(datosBackend)) {




                        const citasFormateadas = datosBackend
                            .filter(cita => cita.fecha && cita.hora_inicio) // 2. Evita que truene si falta fecha u hora
                            .map((cita) => {
                                const [anio, mes, dia] = cita.fecha.split("-");
                                const [hora, minuto] = cita.hora_inicio.split(":")
                                const fechaInicio = new Date(anio, mes - 1, dia, hora, minuto);
                                const [horaFin, minutoFin] = cita.hora_fin.split(":");
                                const fechaFin = new Date(anio, mes - 1, dia, horaFin, minutoFin);



                                return {
                                    id: cita.id,
                                    tittle: `${cita.paciente || 'Paciente'}-${cita.tratamiento || 'Tratamiento'}`,
                                    start: fechaInicio,
                                    end: fechaFin,
                                    allDay: false,
                                    paciente: cita.paciente,
                                    tratamiento: cita.tratamiento,
                                };

                            });

                        const conteoPorDia = {};
                        datosBackend.forEach(cita => {
                            if (cita.fecha) {
                                conteoPorDia[cita.fecha] = (conteoPorDia[cita.fecha] || 0) + 1;
                            }
                        });



                        const eventosResumen = Object.keys(conteoPorDia).map(fechaStr => {
                            const [anio, mes, dia] = fechaStr.split("-");
                            const fechaDia = new Date(anio, mes - 1, dia);

                            return {
                                id: `resumen-${fechaStr}`,
                                tittle: `${conteoPorDia[fechaStr]} citas`,
                                start: fechaDia,
                                end: fechaDia,
                                allDay: true,
                                totalCitas: conteoPorDia[fechaStr],
                                esResumen: true
                            }
                        })


                        setCitas([...citasFormateadas, ...eventosResumen

                        ]);
                    }

                } else {
                    console.log("Error al consultar todas las citas")
                }


            } catch (error) {
                console.error("Error de conexion:", error);
            }
        };

        obtenerCitas();
    }, []);





    const manejarClicCita = (evento) => {

        // 'evento' contiene los datos de la cita que tocaste--> navigate(`/expediente/${evento.id}`);



    };



    const estilosDeCitas = (evento, start, end, isSelected) => {

        // Aquí puedes usar un color hexadecimal inspirado en el logo de Ortholife

        const backgroundColor = '#449dbf'; // Un azul médico/celeste



        const style = {

            backgroundColor: backgroundColor,

            borderRadius: '8px',       // Bordes más redondeados

            opacity: 0.9,              // Un poco de transparencia

            color: 'white',            // Texto en blanco

            border: 'none',            // Quitamos el borde por defecto

            display: 'block',

            fontWeight: 'bold',        // Texto en negrita

            marginTop: '2px',
            marginBottom: '2px',
            border: '2px solid #ffffff', // Un borde blanco grueso separa visualmente las citas pegadas

            padding: '2px 7px',
            overflow: 'hidden',        // Evita desbordamientos extraños
            // Un poco de espacio interno

        };



        return {

            style: style

        };

    };





    return (

        <div className="contenedor-agenda">

            <Calendar

                localizer={localizer}

                events={citas}

                startAccessor="start"


                endAccessor="end"

                culture="es"
                step={30}
                timeslots={1}

                formats={{ eventTimeRangeFormat: () => "" }}

                components={{ event: (props) => <EventoPerzonalizado {...props} vistaActual={vistaActual} /> }}

                views={['day', 'week', 'month']}

                eventPropGetter={estilosDeCitas}

                onSelectEvent={manejarClicCita}

                // Control de la fecha

                date={fechaActual}


                dayPropGetter={dayPropGetter}

                onNavigate={(nuevaFecha) => setFechaActual(nuevaFecha)}



                // 2. NUEVO: Conectamos el estado de la vista al calendario

                view={vistaActual}

                onView={(nuevaVista) => setVistaActual(nuevaVista)}



                style={{ height: '75vh', backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}

                min={new Date(2026, 0, 1, 8, 0)}

                max={new Date(2026, 0, 1, 20, 0)}

                messages={{

                    next: "Siguiente",

                    previous: "Anterior",

                    today: "Hoy",

                    month: "Mes",

                    week: "Semana",

                    day: "Día",

                    noEventsInRange: "No hay citas en este rango."

                }}

            />

        </div>

    );

};



export default Calendario; 