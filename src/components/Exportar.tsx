import React from 'react';

interface ExportarProps {
  contenido: string;
}

const Exportar: React.FC<ExportarProps> = ({ contenido }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(contenido)
      .then(() => {
        alert('Contenido copiado al portapapeles');
      })
      .catch(() => {
        alert('Error al copiar al portapapeles');
      });
  };

  const handleExportToGoogleDocs = () => {
    // Placeholder: Implementar integración con Google Docs API
    alert('Funcionalidad de exportar a Google Docs no implementada aún');
  };

  const handleExportToNotion = () => {
    // Placeholder: Implementar integración con Notion API
    alert('Funcionalidad de exportar a Notion no implementada aún');
  };

  return (
    <div className="exportar-container">
      <h3>Exportar contenido</h3>
      <div className="exportar-buttons">
        <button
          onClick={handleCopy}
          className="btn-copy"
          title="Copiar al portapapeles"
        >
          📋 Copiar
        </button>
        
        <button
          onClick={handleExportToGoogleDocs}
          className="btn-google-docs"
          title="Exportar a Google Docs"
        >
          📄 Exportar a Google Docs
        </button>
        
        <button
          onClick={handleExportToNotion}
          className="btn-notion"
          title="Exportar a Notion"
        >
          📝 Exportar a Notion
        </button>
      </div>
    </div>
  );
};

export default Exportar;
