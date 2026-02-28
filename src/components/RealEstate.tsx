import { useState, useEffect } from 'react';
import { Property, Mortgage } from '../types';
import { load, save, STORAGE_KEYS } from '../utils/storage';
import { formatCurrency, formatPercent, generateId } from '../utils/format';

const emptyProperty: Omit<Property, 'id'> = {
  name: '',
  location: '',
  currentValue: 0,
  purchasePrice: 0,
};

const emptyMortgage: Omit<Mortgage, 'id'> = {
  propertyId: '',
  propertyName: '',
  totalAmount: 0,
  remainingAmount: 0,
  monthlyPayment: 0,
  interestRate: 0,
};

export default function RealEstate() {
  const [properties, setProperties] = useState<Property[]>(() => load(STORAGE_KEYS.PROPERTIES, []));
  const [mortgages, setMortgages] = useState<Mortgage[]>(() => load(STORAGE_KEYS.MORTGAGES, []));

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showMortgageForm, setShowMortgageForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editingMortgageId, setEditingMortgageId] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState(emptyProperty);
  const [mortgageForm, setMortgageForm] = useState(emptyMortgage);

  useEffect(() => { save(STORAGE_KEYS.PROPERTIES, properties); }, [properties]);
  useEffect(() => { save(STORAGE_KEYS.MORTGAGES, mortgages); }, [mortgages]);

  const totalPropertyValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalDebt = mortgages.reduce((sum, m) => sum + m.remainingAmount, 0);
  const netRealEstate = totalPropertyValue - totalDebt;

  // Property CRUD
  function handlePropertySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingPropertyId) {
      setProperties(prev => prev.map(p =>
        p.id === editingPropertyId ? { ...propertyForm, id: editingPropertyId } : p
      ));
    } else {
      setProperties(prev => [...prev, { ...propertyForm, id: generateId() }]);
    }
    resetPropertyForm();
  }

  function editProperty(p: Property) {
    setPropertyForm({
      name: p.name,
      location: p.location,
      currentValue: p.currentValue,
      purchasePrice: p.purchasePrice,
    });
    setEditingPropertyId(p.id);
    setShowPropertyForm(true);
  }

  function deleteProperty(id: string) {
    setProperties(prev => prev.filter(p => p.id !== id));
    setMortgages(prev => prev.filter(m => m.propertyId !== id));
  }

  function resetPropertyForm() {
    setPropertyForm(emptyProperty);
    setEditingPropertyId(null);
    setShowPropertyForm(false);
  }

  // Mortgage CRUD
  function handleMortgageSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedProperty = properties.find(p => p.id === mortgageForm.propertyId);
    const withName = {
      ...mortgageForm,
      propertyName: selectedProperty?.name || mortgageForm.propertyName,
    };
    if (editingMortgageId) {
      setMortgages(prev => prev.map(m =>
        m.id === editingMortgageId ? { ...withName, id: editingMortgageId } : m
      ));
    } else {
      setMortgages(prev => [...prev, { ...withName, id: generateId() }]);
    }
    resetMortgageForm();
  }

  function editMortgage(m: Mortgage) {
    setMortgageForm({
      propertyId: m.propertyId,
      propertyName: m.propertyName,
      totalAmount: m.totalAmount,
      remainingAmount: m.remainingAmount,
      monthlyPayment: m.monthlyPayment,
      interestRate: m.interestRate,
    });
    setEditingMortgageId(m.id);
    setShowMortgageForm(true);
  }

  function deleteMortgage(id: string) {
    setMortgages(prev => prev.filter(m => m.id !== id));
  }

  function resetMortgageForm() {
    setMortgageForm(emptyMortgage);
    setEditingMortgageId(null);
    setShowMortgageForm(false);
  }

  const inputClass = "w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none";

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Valor inmuebles</p>
          <p className="text-xl font-semibold text-white">{formatCurrency(totalPropertyValue)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Hipotecas pendientes</p>
          <p className="text-xl font-semibold text-red-400">-{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Patrimonio inmobiliario neto</p>
          <p className={`text-xl font-semibold ${netRealEstate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(netRealEstate)}
          </p>
        </div>
      </div>

      {/* ========== PROPERTIES SECTION ========== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Propiedades</h2>
          <button
            onClick={() => { resetPropertyForm(); setShowPropertyForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Añadir propiedad
          </button>
        </div>

        {/* Property form modal */}
        {showPropertyForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingPropertyId ? 'Editar propiedad' : 'Nueva propiedad'}
              </h3>
              <form onSubmit={handlePropertySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={propertyForm.name}
                    onChange={e => setPropertyForm(f => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Piso principal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ubicacion</label>
                  <input
                    type="text"
                    value={propertyForm.location}
                    onChange={e => setPropertyForm(f => ({ ...f, location: e.target.value }))}
                    className={inputClass}
                    placeholder="Madrid, España"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Valor actual</label>
                    <input
                      type="number"
                      step="any"
                      value={propertyForm.currentValue || ''}
                      onChange={e => setPropertyForm(f => ({ ...f, currentValue: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Precio de compra</label>
                    <input
                      type="number"
                      step="any"
                      value={propertyForm.purchasePrice || ''}
                      onChange={e => setPropertyForm(f => ({ ...f, purchasePrice: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    {editingPropertyId ? 'Guardar' : 'Añadir'}
                  </button>
                  <button type="button" onClick={resetPropertyForm} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Properties grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(property => {
              const appreciation = property.currentValue - property.purchasePrice;
              const appreciationPct = property.purchasePrice > 0
                ? (appreciation / property.purchasePrice) * 100 : 0;
              const mortgage = mortgages.find(m => m.propertyId === property.id);

              return (
                <div key={property.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{property.name}</h4>
                      <p className="text-gray-500 text-sm">{property.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editProperty(property)} className="text-gray-400 hover:text-white text-sm transition-colors">
                        Editar
                      </button>
                      <button onClick={() => deleteProperty(property.id)} className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Valor actual</span>
                      <span className="text-white font-medium">{formatCurrency(property.currentValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Precio compra</span>
                      <span className="text-white">{formatCurrency(property.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Plusvalia</span>
                      <span className={appreciation >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {appreciation >= 0 ? '+' : ''}{formatCurrency(appreciation)} ({appreciationPct >= 0 ? '+' : ''}{appreciationPct.toFixed(1)}%)
                      </span>
                    </div>
                    {mortgage && (
                      <>
                        <div className="border-t border-gray-700/50 my-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Hipoteca pendiente</span>
                          <span className="text-red-400">-{formatCurrency(mortgage.remainingAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cuota mensual</span>
                          <span className="text-amber-400">{formatCurrency(mortgage.monthlyPayment)}/mes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tipo interes</span>
                          <span className="text-white">{formatPercent(mortgage.interestRate)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 text-center">
            <p className="text-gray-400">No hay propiedades registradas</p>
          </div>
        )}
      </div>

      {/* ========== MORTGAGES SECTION ========== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Hipotecas</h2>
          <button
            onClick={() => { resetMortgageForm(); setShowMortgageForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            disabled={properties.length === 0}
          >
            + Añadir hipoteca
          </button>
        </div>

        {/* Mortgage form modal */}
        {showMortgageForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingMortgageId ? 'Editar hipoteca' : 'Nueva hipoteca'}
              </h3>
              <form onSubmit={handleMortgageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Propiedad asociada</label>
                  <select
                    value={mortgageForm.propertyId}
                    onChange={e => setMortgageForm(f => ({ ...f, propertyId: e.target.value }))}
                    className={inputClass}
                    required
                  >
                    <option value="">Seleccionar propiedad...</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Importe total</label>
                    <input
                      type="number"
                      step="any"
                      value={mortgageForm.totalAmount || ''}
                      onChange={e => setMortgageForm(f => ({ ...f, totalAmount: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Pendiente</label>
                    <input
                      type="number"
                      step="any"
                      value={mortgageForm.remainingAmount || ''}
                      onChange={e => setMortgageForm(f => ({ ...f, remainingAmount: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cuota mensual</label>
                    <input
                      type="number"
                      step="any"
                      value={mortgageForm.monthlyPayment || ''}
                      onChange={e => setMortgageForm(f => ({ ...f, monthlyPayment: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tipo de interes (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={mortgageForm.interestRate || ''}
                      onChange={e => setMortgageForm(f => ({ ...f, interestRate: parseFloat(e.target.value) || 0 }))}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    {editingMortgageId ? 'Guardar' : 'Añadir'}
                  </button>
                  <button type="button" onClick={resetMortgageForm} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mortgages table */}
        {mortgages.length > 0 ? (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Propiedad</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Total</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Pendiente</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Pagado</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Cuota/mes</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Interes</th>
                    <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {mortgages.map(mortgage => {
                    const paid = mortgage.totalAmount - mortgage.remainingAmount;
                    const paidPct = mortgage.totalAmount > 0
                      ? (paid / mortgage.totalAmount) * 100 : 0;
                    return (
                      <tr key={mortgage.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="px-4 py-3 text-sm text-white font-medium">{mortgage.propertyName}</td>
                        <td className="px-4 py-3 text-sm text-white text-right">{formatCurrency(mortgage.totalAmount)}</td>
                        <td className="px-4 py-3 text-sm text-red-400 text-right">{formatCurrency(mortgage.remainingAmount)}</td>
                        <td className="px-4 py-3 text-sm text-green-400 text-right">
                          {formatCurrency(paid)}
                          <span className="text-xs ml-1 opacity-70">({paidPct.toFixed(1)}%)</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-amber-400 text-right">{formatCurrency(mortgage.monthlyPayment)}</td>
                        <td className="px-4 py-3 text-sm text-white text-right">{formatPercent(mortgage.interestRate)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button onClick={() => editMortgage(mortgage)} className="text-gray-400 hover:text-white text-sm mr-3 transition-colors">
                            Editar
                          </button>
                          <button onClick={() => deleteMortgage(mortgage.id)} className="text-gray-400 hover:text-red-400 text-sm transition-colors">
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
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 text-center">
            <p className="text-gray-400">No hay hipotecas registradas</p>
            {properties.length === 0 && (
              <p className="text-gray-500 text-sm mt-1">Añade una propiedad primero</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
