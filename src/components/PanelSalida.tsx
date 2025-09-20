import React from 'react';

interface PanelSalidaProps {
  guion: string;
  isLoading?: boolean;
}

const PanelSalida: React.FC<PanelSalidaProps> = ({ guion, isLoading = false }) => {
  const handleExportTXT = () => {
    const element = document.createElement('a');
    const file = new Blob([guion], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `guion-radio-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = () => {
    // Esta funcionalidad se puede implementar con bibliotecas como jsPDF o html2pdf
    alert('Funcionalidad de exportación PDF próximamente disponible');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(guion);
      alert('Guión copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="panel-salida">
        <div className="loading">
          <p>Generando guión...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!guion) {
    return (
      <div className="panel-salida">
        <div className="empty-state">
          <h3>Panel de Salida</h3>
          <p>El guión generado aparecerá aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-salida">
      <div className="header">
        <h3>Guión Generado</h3>
        <div className="actions">
          <button 
            className="btn btn-primary" 
            onClick={handleCopyToClipboard}
            title="Copiar al portapapeles"
          >
            📋 Copiar
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleExportTXT}
            title="Exportar como TXT"
          >
            📄 TXT
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleExportPDF}
            title="Exportar como PDF"
          >
            📁 PDF
          </button>
        </div>
      </div>
      
      <div className="content">
        <textarea 
          className="guion-output"
          value={guion}
          readOnly
          rows={20}
          placeholder="El guión generado aparecerá aquí..."
        />
      </div>
      
      <div className="footer">
        <small>
          Palabras: {guion.split(/\s+/).length} | 
          Caracteres: {guion.length}
        </small>
      </div>
    </div>
  );
};

export default PanelSalida;
