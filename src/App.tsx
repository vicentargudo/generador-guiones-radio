import React, { useState } from 'react';

interface ScriptData {
  title: string;
  format: string;
  duration: string;
  topic: string;
  tone: string;
}

interface ScriptSection {
  type: 'intro' | 'main' | 'music' | 'commercial' | 'outro';
  content: string;
  duration: number;
}

const App: React.FC = () => {
  const [scriptData, setScriptData] = useState<ScriptData>({
    title: '',
    format: 'talk-show',
    duration: '30',
    topic: '',
    tone: 'informativo'
  });

  const [generatedScript, setGeneratedScript] = useState<ScriptSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScriptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateScript = async () => {
    setIsLoading(true);
    
    // Simulación de generación de guión (aquí se integraría con API de IA)
    const mockScript: ScriptSection[] = [
      {
        type: 'intro',
        content: `¡Bienvenidos a ${scriptData.title}! Soy su presentador y hoy vamos a hablar sobre ${scriptData.topic}.`,
        duration: 30
      },
      {
        type: 'music',
        content: 'MÚSICA: Sintonía de entrada (30 segundos)',
        duration: 30
      },
      {
        type: 'main',
        content: `Hoy profundizaremos en ${scriptData.topic}. Este tema es especialmente relevante porque...`,
        duration: parseInt(scriptData.duration) * 60 - 120 // Resto del tiempo
      },
      {
        type: 'commercial',
        content: 'PAUSA COMERCIAL (60 segundos)',
        duration: 60
      },
      {
        type: 'outro',
        content: `Esto ha sido todo por hoy en ${scriptData.title}. Nos vemos en el próximo programa.`,
        duration: 30
      }
    ];

    setTimeout(() => {
      setGeneratedScript(mockScript);
      setIsLoading(false);
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportScript = () => {
    const scriptText = generatedScript.map(section => 
      `[${section.type.toUpperCase()} - ${formatTime(section.duration)}]\n${section.content}\n`
    ).join('\n');

    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptData.title || 'guion-radio'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Generador de Guiones de Radio
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de configuración */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Configuración del Programa</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Programa
                </label>
                <input
                  type="text"
                  name="title"
                  value={scriptData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: El Show Matutino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <select
                  name="format"
                  value={scriptData.format}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="talk-show">Talk Show</option>
                  <option value="noticias">Noticias</option>
                  <option value="musical">Musical</option>
                  <option value="podcast">Podcast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={scriptData.duration}
                  onChange={handleInputChange}
                  min="5"
                  max="180"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema Principal
                </label>
                <textarea
                  name="topic"
                  value={scriptData.topic}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el tema principal del programa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tono
                </label>
                <select
                  name="tone"
                  value={scriptData.tone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="informativo">Informativo</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="humoristico">Humorístico</option>
                </select>
              </div>

              <button
                onClick={generateScript}
                disabled={isLoading || !scriptData.title || !scriptData.topic}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Generando...' : 'Generar Guión'}
              </button>
            </div>
          </div>

          {/* Vista previa del guión */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Guión Generado</h2>
              {generatedScript.length > 0 && (
                <button
                  onClick={exportScript}
                  className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  Exportar
                </button>
              )}
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedScript.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Completa los campos y haz clic en "Generar Guión" para ver el resultado
                </p>
              ) : (
                generatedScript.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm uppercase tracking-wide text-blue-600">
                        {section.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTime(section.duration)}
                      </span>
                    </div>
                    <p className="text-gray-700">{section.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
