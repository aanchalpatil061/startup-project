export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (iso: string) => {
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
};

export const formatScore = (marks: number, total: number) =>
  `${marks}/${total}`;

export const formatPercentage = (value: number) =>
  `${Math.round(value)}%`;

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export const getGradeColor = (percentage: number): string => {
  if (percentage >= 75) return '#16A34A';
  if (percentage >= 50) return '#D97706';
  return '#DC2626';
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    evaluated: '#16A34A',
    pending: '#D97706',
    disputed: '#2563EB',
    resolved: '#16A34A',
    rejected: '#DC2626',
    under_review: '#7C3AED',
    active: '#16A34A',
    completed: '#71717A',
    upcoming: '#2563EB',
  };
  return map[status] ?? '#71717A';
};

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    evaluated: 'Evaluated',
    pending: 'Pending',
    disputed: 'Disputed',
    resolved: 'Resolved',
    rejected: 'Rejected',
    under_review: 'Under Review',
    active: 'Active',
    completed: 'Completed',
    upcoming: 'Upcoming',
    archived: 'Archived',
  };
  return map[status] ?? status;
};
