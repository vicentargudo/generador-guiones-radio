import React, { useState } from 'react';

interface FormularioProps {}

interface FormData {
  artista: string;
  cancion: string;
  año: string;
  contexto: string;
  anecdotas: string;
  plantilla: string;
  duracion: string;
}

const Formulario: React.FC<FormularioProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    artista: '',
    cancion: '',
    año: '',
    contexto: '',
    anecdotas: '',
    plantilla: '',
    duracion: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí se puede agregar la lógica para procesar el formulario
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-guion">
      <h2>Generador de Guiones de Radio</h2>
      
      <div className="campo">
        <label htmlFor="artista">Artista:</label>
        <input
          type="text"
          id="artista"
          name="artista"
          value={formData.artista}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="cancion">Canción:</label>
        <input
          type="text"
          id="cancion"
          name="cancion"
          value={formData.cancion}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="año">Año:</label>
        <input
          type="text"
          id="año"
          name="año"
          value={formData.año}
          onChange={handleInputChange}
          placeholder="Ej: 1990"
        />
      </div>

      <div className="campo">
        <label htmlFor="contexto">Contexto:</label>
        <textarea
          id="contexto"
          name="contexto"
          value={formData.contexto}
          onChange={handleInputChange}
          rows={4}
          placeholder="Proporciona contexto sobre la canción, álbum, época, etc."
        />
      </div>

      <div className="campo">
        <label htmlFor="anecdotas">Anécdotas:</label>
        <textarea
          id="anecdotas"
          name="anecdotas"
          value={formData.anecdotas}
          onChange={handleInputChange}
          rows={4}
          placeholder="Historias interesantes, datos curiosos, etc."
        />
      </div>

      <div className="campo">
        <label htmlFor="plantilla">Plantilla:</label>
        <select
          id="plantilla"
          name="plantilla"
          value={formData.plantilla}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona una plantilla</option>
          <option value="clasica">Clásica</option>
          <option value="moderna">Moderna</option>
          <option value="informal">Informal</option>
          <option value="profesional">Profesional</option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="duracion">Duración (minutos):</label>
        <input
          type="number"
          id="duracion"
          name="duracion"
          value={formData.duracion}
          onChange={handleInputChange}
          min="1"
          max="60"
          placeholder="Ej: 5"
        />
      </div>

      <button type="submit" className="btn-generar">
        Generar Guión
      </button>
    </form>
  );
};

export default Formulario;
