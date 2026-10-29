import React from 'react';
import { CheckCircle } from 'lucide-react';
import './AlertaExito.css';


export default function AlertaExito({ isOpen, mensaje, onClose }) {
    if (!isOpen) return null;

    return (
        <div className='alerta-overlay'>
            <div className='alerta-caja'>
                <CheckCircle size={60} color="#22c55e" className='"alerta-icono' />
                <h2 className='alerta-titulo' >¡Completado!</h2>
                <p className='alerta-mensaje'>{mensaje} </p>
                <button className='alerta-btn' onClick={onClose} >
                    Aceptar
                </button>

            </div>
        </div>
    )
}