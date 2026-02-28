import { useState, useEffect } from 'react';
import { Asset } from '../types';
import { load, save, STORAGE_KEYS } from '../utils/storage';
import { formatCurrency, formatCurrencyDetailed, generateId } from '../utils/format';

const emptyAsset: Omit<Asset, 'id'> = {
  ticker: '',
  name: '',
  quantity: 0,
  avgPrice: 0,
  currentPrice: 0,
};

export default function Portfolio() {
  const [assets, setAssets] = useState<Asset[]>(() => load(STORAGE_KEYS.ASSETS, []));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAsset);

  useEffect(() => {
    save(STORAGE_KEYS.ASSETS, assets);
  }, [assets]);

  const totalValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.quantity * a.avgPrice, 0);
  const totalPL = totalValue - totalCost;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      setAssets(prev => prev.map(a => a.id === editingId ? { ...form, id: editingId } : a));
    } else {
      setAssets(prev => [...prev, { ...form, id: generateId() }]);
    }
    resetForm();
  }

  function handleEdit(asset: Asset) {
    setForm({
      ticker: asset.ticker,
      name: asset.name,
      quantity: asset.quantity,
      avgPrice: asset.avgPrice,
      currentPrice: asset.currentPrice,
    });
    setEditingId(asset.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  function resetForm() {
    setForm(emptyAsset);
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio de Inversiones</h2>
          <p className="text-gray-400 text-sm mt-1">Gestiona tus activos financieros</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Añadir activo
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Valor total</p>
          <p className="text-xl font-semibold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Coste total</p>
          <p className="text-xl font-semibold text-white">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">P&L total</p>
          <p className={`text-xl font-semibold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPL >= 0 ? '+' : ''}{formatCurrency(totalPL)}
          </p>
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Editar activo' : 'Nuevo activo'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ticker</label>
                  <input
                    type="text"
                    value={form.ticker}
                    onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="AAPL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Apple Inc."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cantidad</label>
                  <input
                    type="number"
                    step="any"
                    value={form.quantity || ''}
                    onChange={e => setForm(f => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Precio medio</label>
                  <input
                    type="number"
                    step="any"
                    value={form.avgPrice || ''}
                    onChange={e => setForm(f => ({ ...f, avgPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Precio actual</label>
                  <input
                    type="number"
                    step="any"
                    value={form.currentPrice || ''}
                    onChange={e => setForm(f => ({ ...f, currentPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {editingId ? 'Guardar cambios' : 'Añadir'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assets table */}
      {assets.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Ticker</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Nombre</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Cantidad</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">P. Medio</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">P. Actual</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Valor</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">P&L</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const value = asset.quantity * asset.currentPrice;
                  const cost = asset.quantity * asset.avgPrice;
                  const pl = value - cost;
                  const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                  return (
                    <tr key={asset.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="px-4 py-3 text-sm font-mono text-indigo-400 font-medium">{asset.ticker}</td>
                      <td className="px-4 py-3 text-sm text-white">{asset.name}</td>
                      <td className="px-4 py-3 text-sm text-white text-right">{asset.quantity}</td>
                      <td className="px-4 py-3 text-sm text-white text-right">{formatCurrencyDetailed(asset.avgPrice)}</td>
                      <td className="px-4 py-3 text-sm text-white text-right">{formatCurrencyDetailed(asset.currentPrice)}</td>
                      <td className="px-4 py-3 text-sm text-white text-right font-medium">{formatCurrency(value)}</td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
                        <span className="text-xs ml-1 opacity-70">({plPct >= 0 ? '+' : ''}{plPct.toFixed(1)}%)</span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="text-gray-400 hover:text-white text-sm mr-3 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700/50 text-center">
          <p className="text-gray-400">No hay activos en tu portfolio</p>
          <p className="text-gray-500 text-sm mt-1">Pulsa &quot;Añadir activo&quot; para comenzar</p>
        </div>
      )}
    </div>
  );
}
