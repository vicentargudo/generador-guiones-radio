import React, { useState } from 'react';

export interface Plantilla {
  id: string;
  nombre: string;
  formato: string;
  descripcion: string;
  estructura: string[];
}

const plantillasDisponibles: Plantilla[] = [
  {
    id: 'noticiario-tradicional',
    nombre: 'Noticiario Tradicional',
    formato: 'Noticias',
    descripcion: 'Formato clásico de noticiario radiofónico',
    estructura: [
      'Entrada musical e identificación',
      'Saludo y presentación',
      'Noticia principal',
      'Bloque de noticias nacionales',
      'Bloque de noticias internacionales',
      'Deportes',
      'El tiempo',
      'Cierre y despedida'
    ]
  },
  {
    id: 'magazine-matinal',
    nombre: 'Magazine Matinal',
    formato: 'Magazine',
    descripcion: 'Programa de variedades para la mañana',
    estructura: [
      'Sintonía y presentación',
      'Resumen de noticias del día',
      'Entrevista o reportaje principal',
      'Sección de entretenimiento',
      'Música y concursos',
      'Servicios públicos e información práctica',
      'Avance del día siguiente',
      'Despedida'
    ]
  },
  {
    id: 'programa-musical',
    nombre: 'Programa Musical',
    formato: 'Musical',
    descripcion: 'Programa centrado en música y artistas',
    estructura: [
      'Intro musical y presentación',
      'Primera tanda musical',
      'Comentarios sobre los artistas',
      'Segunda tanda musical',
      'Entrevista o curiosidades musicales',
      'Tercera tanda musical',
      'Solicitudes de oyentes',
      'Cierre musical'
    ]
  },
  {
    id: 'tertulia-debate',
    nombre: 'Tertulia y Debate',
    formato: 'Debate',
    descripcion: 'Programa de análisis y debate de actualidad',
    estructura: [
      'Presentación del programa y moderador',
      'Presentación de invitados',
      'Planteamiento del tema principal',
      'Primera ronda de opiniones',
      'Debate abierto',
      'Segunda ronda de análisis',
      'Conclusiones',
      'Despedida y próximo programa'
    ]
  },
  {
    id: 'reportaje-documental',
    nombre: 'Reportaje Documental',
    formato: 'Documental',
    descripcion: 'Formato de reportaje en profundidad',
    estructura: [
      'Introducción al tema',
      'Contexto histórico o situacional',
      'Primera fuente o testimonio',
      'Desarrollo del tema central',
      'Segunda fuente o testimonio',
      'Análisis y datos relevantes',
      'Tercera fuente o experto',
      'Conclusiones y reflexión final'
    ]
  }
];

interface SelectorPlantillasProps {
  onSeleccionarPlantilla: (plantilla: Plantilla) => void;
  plantillaSeleccionada?: Plantilla;
}

const SelectorPlantillas: React.FC<SelectorPlantillasProps> = ({ 
  onSeleccionarPlantilla, 
  plantillaSeleccionada 
}) => {
  const [filtroFormato, setFiltroFormato] = useState<string>('');
  
  const formatosUnicos = Array.from(new Set(plantillasDisponibles.map(p => p.formato)));
  
  const plantillasFiltradas = filtroFormato 
    ? plantillasDisponibles.filter(p => p.formato === filtroFormato)
    : plantillasDisponibles;

  return (
    <div className="selector-plantillas">
      <h3>Seleccionar Plantilla de Guión</h3>
      
      <div className="filtros">
        <label htmlFor="formato-filter">Filtrar por formato:</label>
        <select 
          id="formato-filter"
          value={filtroFormato} 
          onChange={(e) => setFiltroFormato(e.target.value)}
        >
          <option value="">Todos los formatos</option>
          {formatosUnicos.map(formato => (
            <option key={formato} value={formato}>{formato}</option>
          ))}
        </select>
      </div>

      <div className="lista-plantillas">
        {plantillasFiltradas.map(plantilla => (
          <div 
            key={plantilla.id} 
            className={`plantilla-item ${
              plantillaSeleccionada?.id === plantilla.id ? 'seleccionada' : ''
            }`}
            onClick={() => onSeleccionarPlantilla(plantilla)}
          >
            <h4>{plantilla.nombre}</h4>
            <p className="formato">{plantilla.formato}</p>
            <p className="descripcion">{plantilla.descripcion}</p>
            
            <div className="estructura-preview">
              <strong>Estructura:</strong>
              <ol>
                {plantilla.estructura.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {plantillaSeleccionada && (
        <div className="plantilla-seleccionada-info">
          <h4>Plantilla seleccionada: {plantillaSeleccionada.nombre}</h4>
          <p>Esta plantilla se aplicará como base para generar el guión.</p>
        </div>
      )}
    </div>
  );
};

export { SelectorPlantillas, plantillasDisponibles };
export default SelectorPlantillas;
