import { useMemo } from 'react';
import { Asset, Property, Mortgage } from '../types';
import { load, STORAGE_KEYS } from '../utils/storage';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const assets = useMemo(() => load<Asset[]>(STORAGE_KEYS.ASSETS, []), []);
  const properties = useMemo(() => load<Property[]>(STORAGE_KEYS.PROPERTIES, []), []);
  const mortgages = useMemo(() => load<Mortgage[]>(STORAGE_KEYS.MORTGAGES, []), []);

  const portfolioValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const portfolioCost = assets.reduce((sum, a) => sum + a.quantity * a.avgPrice, 0);
  const portfolioPL = portfolioValue - portfolioCost;

  const realEstateValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalDebt = mortgages.reduce((sum, m) => sum + m.remainingAmount, 0);
  const totalMonthlyMortgage = mortgages.reduce((sum, m) => sum + m.monthlyPayment, 0);

  const netWorth = portfolioValue + realEstateValue - totalDebt;

  return (
    <div className="space-y-6">
      {/* Net Worth hero */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/20">
        <p className="text-gray-400 text-sm uppercase tracking-wider">Patrimonio neto total</p>
        <p className={`text-5xl font-bold mt-2 ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
          {formatCurrency(netWorth)}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Portfolio inversiones</p>
          <p className="text-2xl font-semibold text-white mt-1">{formatCurrency(portfolioValue)}</p>
          <p className={`text-sm mt-1 ${portfolioPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioPL >= 0 ? '+' : ''}{formatCurrency(portfolioPL)} P&L
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Inmuebles</p>
          <p className="text-2xl font-semibold text-white mt-1">{formatCurrency(realEstateValue)}</p>
          <p className="text-sm mt-1 text-gray-500">{properties.length} propiedad{properties.length !== 1 ? 'es' : ''}</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Deuda pendiente</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">-{formatCurrency(totalDebt)}</p>
          <p className="text-sm mt-1 text-gray-500">{mortgages.length} hipoteca{mortgages.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <p className="text-gray-400 text-sm">Cuota mensual hipotecas</p>
          <p className="text-2xl font-semibold text-amber-400 mt-1">{formatCurrency(totalMonthlyMortgage)}/mes</p>
        </div>
      </div>

      {/* Portfolio breakdown */}
      {assets.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Desglose del portfolio</h3>
          <div className="space-y-3">
            {assets.map(asset => {
              const value = asset.quantity * asset.currentPrice;
              const percentage = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
              const pl = (asset.currentPrice - asset.avgPrice) * asset.quantity;
              return (
                <div key={asset.id} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono text-indigo-400">{asset.ticker}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm text-white">{formatCurrency(value)}</div>
                  <div className={`w-24 text-right text-sm ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Properties breakdown */}
      {properties.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Propiedades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(property => {
              const mortgage = mortgages.find(m => m.propertyId === property.id);
              const equity = property.currentValue - (mortgage?.remainingAmount || 0);
              return (
                <div key={property.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                  <p className="text-white font-medium">{property.name}</p>
                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-400">Valor</span>
                    <span className="text-white">{formatCurrency(property.currentValue)}</span>
                  </div>
                  {mortgage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Hipoteca pend.</span>
                      <span className="text-red-400">-{formatCurrency(mortgage.remainingAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mt-1 pt-1 border-t border-gray-700/50">
                    <span className="text-gray-400">Patrimonio neto</span>
                    <span className="text-green-400">{formatCurrency(equity)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {assets.length === 0 && properties.length === 0 && (
        <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700/50 text-center">
          <p className="text-gray-400 text-lg">No hay datos todavia</p>
          <p className="text-gray-500 text-sm mt-2">
            Añade activos en Portfolio o propiedades en Inmuebles para comenzar
          </p>
        </div>
      )}
    </div>
  );
}
