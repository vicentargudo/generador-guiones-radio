import { YearProjection } from '../types';

export function calculateProjection(
  totalHoldings: number,
  annualAppreciation: number,
  monthlyExpenses: number,
  monthlyIncome: number,
  maxYears: number = 80
): YearProjection[] {
  const projections: YearProjection[] = [];
  let balance = totalHoldings;
  const currentYear = new Date().getFullYear();
  const rate = annualAppreciation / 100;
  const annualIncome = monthlyIncome * 12;
  const annualExpenses = monthlyExpenses * 12;
  const annualNetFlow = annualIncome - annualExpenses;

  projections.push({
    year: 0,
    date: String(currentYear),
    startBalance: balance,
    appreciation: 0,
    totalIncome: 0,
    totalExpenses: 0,
    endBalance: balance,
  });

  for (let i = 1; i <= maxYears; i++) {
    const startBalance = balance;
    const appreciation = startBalance > 0 ? startBalance * rate : 0;
    const endBalance = startBalance + appreciation + annualNetFlow;

    projections.push({
      year: i,
      date: String(currentYear + i),
      startBalance: Math.round(startBalance * 100) / 100,
      appreciation: Math.round(appreciation * 100) / 100,
      totalIncome: annualIncome,
      totalExpenses: annualExpenses,
      endBalance: Math.round(endBalance * 100) / 100,
    });

    if (endBalance <= 0) break;
    balance = endBalance;
  }

  return projections;
}

export function getYearsOfSustainability(
  projections: YearProjection[]
): number | 'indefinite' {
  const lastProjection = projections[projections.length - 1];
  if (lastProjection.endBalance > 0) {
    return 'indefinite';
  }
  return projections.length - 1;
}
