import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import { useNavigate } from 'react-router-dom';

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



const Calendario = () => {
    const navigate = useNavigate();
    const [fechaActual, setFechaActual] = useState(new Date());

    // 1. NUEVO: Estado para controlar si estamos en Día, Semana o Mes
    const [vistaActual, setVistaActual] = useState('day');

    const [citas, setCitas] = useState([
        {
            title: 'Elida Torres',
            start: new Date(2026, 9, 11, 10, 0),
            end: new Date(2026, 9, 11, 11, 0),
        },
        {
            title: 'Axel Quiñonez',
            start: new Date(2026, 9, 11, 10, 30),
            end: new Date(2026, 9, 11, 11, 30),
        },
        {
            title: 'Jazmin Dominguez',
            start: new Date(2026, 9, 11, 12, 0),
            end: new Date(2026, 9, 11, 13, 0),
        }
    ]);


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
            padding: '5px'             // Un poco de espacio interno
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
                views={['day', 'week', 'month']}
                eventPropGetter={estilosDeCitas}
                onSelectEvent={manejarClicCita}
                // Control de la fecha
                date={fechaActual}
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