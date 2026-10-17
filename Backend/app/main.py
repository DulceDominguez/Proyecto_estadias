from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, time
from pydantic import BaseModel

from app.database import get_db
import app.models as models

app = FastAPI(title="Sistema de Agenda Dental", version="1.0")

# Configuración de CORS para React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ESQUEMAS PYDANTIC ---

class PacienteCreate(BaseModel):
    nombre: str
    fecha_nacimiento: date | None = None
    telefono: str | None = None

class CitaCreate(BaseModel):
    id_paciente: int
    id_odontologo: int
    id_tratamiento: int
    fecha: date
    hora: time
    estatus: str = "Pendiente"
    notas: str | None = None

class CitaUpdate(BaseModel):
    id_odontologo: int | None = None
    id_tratamiento: int | None = None
    fecha: date | None = None
    hora: time | None = None
    estatus: str | None = None
    notas: str | None = None


# --- RUTAS PRINCIPALES ---

@app.get("/")
def leer_raiz():
    return {"mensaje": "¡El backend del sistema dental está funcionando correctamente!"}

@app.get("/test-db")
def probar_conexion_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"estado": "Conexión a PostgreSQL exitosa"}
    except Exception as e:
        return {"estado": "Error de conexión", "detalles": str(e)}


# --- ENDPOINTS GET ---

@app.get("/odontologos")
def obtener_odontologos(db: Session = Depends(get_db)):
    return db.query(models.Odontologo).all()

@app.get("/pacientes")
def obtener_pacientes(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

@app.get("/tratamientos")
def obtener_tratamientos(db: Session = Depends(get_db)):
    return db.query(models.Tratamiento).all()

@app.get("/citas")
def obtener_citas(db: Session = Depends(get_db)):
    citas = db.query(models.Cita).all()
    lista_citas = []
    for c in citas:
        paciente = db.query(models.Paciente).get(c.paciente_id)
        odontologo = db.query(models.Odontologo).get(c.odontologo_id)
        tratamiento = db.query(models.Tratamiento).get(c.tratamiento_id)
        
        lista_citas.append({
            "id": c.id,
            "fecha": str(c.fecha),
            "hora": str(c.hora)[:5],
            "estatus": c.estatus,
            "notas": c.notas,
            "paciente": paciente.nombre if paciente else "Desconocido",
            "paciente_id": c.paciente_id,
            "odontologo": odontologo.nombre if odontologo else "Desconocido",
            "odontologo_id": c.odontologo_id,
            "tratamiento": tratamiento.nombre if tratamiento else "Desconocido",
            "tratamiento_id": c.tratamiento_id
        })
    return lista_citas


# --- ENDPOINTS POST ---

@app.post("/pacientes")
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    try:
        nuevo_paciente = models.Paciente(
            nombre=paciente.nombre,
            fecha_nacimiento=paciente.fecha_nacimiento,
            telefono=paciente.telefono
        )
        db.add(nuevo_paciente)
        db.commit()
        db.refresh(nuevo_paciente)
        return {"mensaje": "¡Paciente registrado con éxito!", "paciente": nuevo_paciente}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/citas")
def agendar_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    try:
        nueva_cita = models.Cita(
            paciente_id=cita.id_paciente,
            odontologo_id=cita.id_odontologo,
            tratamiento_id=cita.id_tratamiento,
            fecha=cita.fecha,
            hora=cita.hora,
            estatus=cita.estatus,
            notas=cita.notas
        )
        db.add(nueva_cita)
        db.commit()
        db.refresh(nueva_cita)
        return {"mensaje": "¡Cita agendada con éxito!", "cita": nueva_cita}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# --- ENDPOINT PUT (EDITAR CITA) ---

@app.put("/citas/{cita_id}")
def actualizar_cita(cita_id: int, cita_data: CitaUpdate, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).get(cita_id)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    try:
        if cita_data.id_odontologo is not None:
            cita.odontologo_id = cita_data.id_odontologo
        if cita_data.id_tratamiento is not None:
            cita.tratamiento_id = cita_data.id_tratamiento
        if cita_data.fecha is not None:
            cita.fecha = cita_data.fecha
        if cita_data.hora is not None:
            cita.hora = cita_data.hora
        if cita_data.estatus is not None:
            cita.estatus = cita_data.estatus
        if cita_data.notas is not None:
            cita.notas = cita_data.notas

        db.commit()
        db.refresh(cita)
        return {"mensaje": "¡Cita actualizada con éxito!", "cita": cita}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# --- ENDPOINT DELETE (ELIMINAR CITA) ---

@app.delete("/citas/{cita_id}")
def eliminar_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(models.Cita).get(cita_id)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    try:
        db.delete(cita)
        db.commit()
        return {"mensaje": "Cita eliminada correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))