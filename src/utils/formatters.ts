interface FormattedValue {
  value: string;
  color: string;
}

export function formatCSR(csr: number | string): FormattedValue {
  const csrNum = Number(csr);
  if (isNaN(csrNum)) return { value: '--', color: 'text-gray-900' };
  
  let color = 'text-purple-300';
  if (csrNum >= 400000) color = 'text-purple-900';
  else if (csrNum >= 350000) color = 'text-purple-700';
  else if (csrNum >= 300000) color = 'text-purple-600';
  else if (csrNum >= 250000) color = 'text-purple-500';
  else if (csrNum >= 200000) color = 'text-purple-400';
  else if (csrNum >= 150000) color = 'text-purple-300';
  
  return {
    value: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(csrNum),
    color
  };
}

export function formatRanking(points: number | string): FormattedValue {
  const rankingPoints = Number(points);
  if (isNaN(rankingPoints)) return { value: 'N/A', color: 'text-gray-900' };
  
  let color = 'text-blue-300';
  if (rankingPoints >= 90) color = 'text-blue-900';
  else if (rankingPoints >= 80) color = 'text-blue-700';
  else if (rankingPoints >= 70) color = 'text-blue-600';
  else if (rankingPoints >= 60) color = 'text-blue-500';
  else if (rankingPoints >= 50) color = 'text-blue-400';
  else if (rankingPoints >= 40) color = 'text-blue-300';
  
  return {
    value: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(rankingPoints),
    color
  };
}

export function formatSalary(salary: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(salary);
}

interface Player {
  nationality: string;
  dualnationality?: string;
  capped_for?: string;
}

export function formatNationality(player: Player): string {
  let nationality = player.nationality;
  if (player.dualnationality) {
    nationality += `/${player.dualnationality}`;
  }
  if (player.capped_for) {
    nationality += '*';
  }
  return nationality;
}

export function formatBirthday(birthday: string | undefined): string {
  if (!birthday) return '';
  const [round, day] = birthday.split(':');
  return `R${parseInt(round)}, D${day}`;
}