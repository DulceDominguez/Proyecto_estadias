from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column("id_usuario", Integer, primary_key=True, index=True, autoincrement=True)
    correo = Column(String(150), unique=True, index=True, nullable=False)
    contrasena = Column("contrasena_hash", String(255), nullable=False)

class Odontologo(Base):
    __tablename__ = "odontologos"
    
    id = Column("id_odontologo", Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(150), nullable=False)

class Paciente(Base):
    __tablename__ = "pacientes"
    
    id = Column("id_paciente", Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(150), nullable=False)
    edad = Column(Integer)
    telefono = Column(String(20), nullable=True)

class Tratamiento(Base):
    __tablename__ = "tratamientos"
    
    id = Column("id_tratamiento", Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)

class Cita(Base):
    __tablename__ = "citas"
    
    id = Column("id_cita", Integer, primary_key=True, index=True, autoincrement=True)
    paciente_id = Column("id_paciente", Integer, ForeignKey("pacientes.id_paciente"), nullable=False)
    odontologo_id = Column("id_odontologo", Integer, ForeignKey("odontologos.id_odontologo"), nullable=False)
    tratamiento_id = Column("id_tratamiento", Integer, ForeignKey("tratamientos.id_tratamiento"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    estatus = Column(String(20), nullable=False)
    notas = Column(Text, nullable=True)