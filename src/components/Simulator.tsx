import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Asset, Property, Mortgage, SimulatorConfig } from '../types';
import { load, save, STORAGE_KEYS } from '../utils/storage';
import { formatCurrency } from '../utils/format';
import { calculateProjection, getYearsOfSustainability } from '../utils/simulator';

const defaultConfig: SimulatorConfig = {
  totalHoldings: 0,
  useAutoHoldings: true,
  annualAppreciation: 5,
  monthlyExpenses: 2000,
  monthlyIncome: 0,
};

export default function Simulator() {
  const [config, setConfig] = useState<SimulatorConfig>(
    () => load(STORAGE_KEYS.SIMULATOR, defaultConfig)
  );

  useEffect(() => {
    save(STORAGE_KEYS.SIMULATOR, config);
  }, [config]);

  const autoHoldings = useMemo(() => {
    const assets: Asset[] = load(STORAGE_KEYS.ASSETS, []);
    const properties: Property[] = load(STORAGE_KEYS.PROPERTIES, []);
    const mortgages: Mortgage[] = load(STORAGE_KEYS.MORTGAGES, []);

    const portfolioValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    const realEstateValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
    const totalDebt = mortgages.reduce((sum, m) => sum + m.remainingAmount, 0);

    return portfolioValue + realEstateValue - totalDebt;
  }, []);

  const holdings = config.useAutoHoldings ? autoHoldings : config.totalHoldings;

  const projections = useMemo(
    () => calculateProjection(
      holdings,
      config.annualAppreciation,
      config.monthlyExpenses,
      config.monthlyIncome,
    ),
    [holdings, config.annualAppreciation, config.monthlyExpenses, config.monthlyIncome]
  );

  const sustainability = getYearsOfSustainability(projections);
  const currentYear = new Date().getFullYear();

  const inputClass = "w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Simulador de Patrimonio</h2>
        <p className="text-gray-400 text-sm mt-1">
          Proyeccion de sostenibilidad financiera año a año
        </p>
      </div>

      {/* Input fields */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Holdings totales</label>
            <div className="relative">
              <input
                type="number"
                value={config.useAutoHoldings ? autoHoldings : config.totalHoldings}
                onChange={e => setConfig(c => ({
                  ...c,
                  totalHoldings: parseFloat(e.target.value) || 0,
                  useAutoHoldings: false,
                }))}
                className={inputClass}
              />
              {!config.useAutoHoldings && (
                <button
                  onClick={() => setConfig(c => ({ ...c, useAutoHoldings: true }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition-colors"
                >
                  Auto
                </button>
              )}
            </div>
            {config.useAutoHoldings && (
              <p className="text-xs text-indigo-400 mt-1">Calculado desde portfolio + inmuebles</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Revalorizacion anual (%)</label>
            <input
              type="number"
              step="0.1"
              value={config.annualAppreciation}
              onChange={e => setConfig(c => ({
                ...c,
                annualAppreciation: parseFloat(e.target.value) || 0,
              }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Gasto mensual necesario</label>
            <input
              type="number"
              value={config.monthlyExpenses}
              onChange={e => setConfig(c => ({
                ...c,
                monthlyExpenses: parseFloat(e.target.value) || 0,
              }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Ingreso recurrente mensual</label>
            <input
              type="number"
              value={config.monthlyIncome}
              onChange={e => setConfig(c => ({
                ...c,
                monthlyIncome: parseFloat(e.target.value) || 0,
              }))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Result banner */}
      <div className={`rounded-xl p-6 border ${
        sustainability === 'indefinite'
          ? 'bg-green-900/30 border-green-500/30'
          : (sustainability as number) > 30
            ? 'bg-emerald-900/30 border-emerald-500/30'
            : (sustainability as number) > 10
              ? 'bg-amber-900/30 border-amber-500/30'
              : 'bg-red-900/30 border-red-500/30'
      }`}>
        {sustainability === 'indefinite' ? (
          <div>
            <p className="text-green-400 text-lg font-semibold">
              Tu patrimonio es sostenible indefinidamente
            </p>
            <p className="text-green-300/70 text-sm mt-1">
              Tus ingresos recurrentes y la revalorizacion cubren tus gastos mensuales
            </p>
          </div>
        ) : (
          <div>
            <p className="text-white text-lg font-semibold">
              Puedes mantener tu nivel de vida durante{' '}
              <span className={
                (sustainability as number) > 30
                  ? 'text-emerald-400'
                  : (sustainability as number) > 10
                    ? 'text-amber-400'
                    : 'text-red-400'
              }>
                {sustainability} años
              </span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Hasta aproximadamente el año {currentYear + (sustainability as number)}
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      {projections.length > 1 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Proyeccion patrimonial</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={projections} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(v: number) => {
                  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                  return String(v);
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value: number) => [formatCurrency(value), 'Balance']}
              />
              <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="endBalance"
                stroke="#10B981"
                fill="url(#balanceGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Year-by-year table */}
      {projections.length > 1 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <h3 className="text-lg font-semibold text-white p-6 pb-4">Desglose por años</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Año</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Balance inicio</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Revalorizacion</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Ingresos</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Gastos</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-4 py-3 uppercase tracking-wider">Balance final</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((row) => (
                  <tr key={row.year} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">
                      {formatCurrency(row.startBalance)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-400 text-right">
                      {row.year === 0 ? '-' : `+${formatCurrency(row.appreciation)}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-400 text-right">
                      {row.year === 0 ? '-' : `+${formatCurrency(row.totalIncome)}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-400 text-right">
                      {row.year === 0 ? '-' : `-${formatCurrency(row.totalExpenses)}`}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${
                      row.endBalance >= 0 ? 'text-white' : 'text-red-400'
                    }`}>
                      {formatCurrency(row.endBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
