export function jsonToCsv(data: Record<string, unknown>[], columns: string[], columnTitles: string[]): string {
  if (!data || data.length === 0) return '';

  // 1. Header Row (using human-readable titles)
  const header = columnTitles.join(',');

  // 2. Data Rows
  const rows = data.map(row => {
    return columns.map(col => {
      let value = row[col];

      // Handle nested objects or complex types by stringifying
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }

      // Escape double quotes and wrap in quotes if necessary
      if (typeof value === 'string') {
        const stringValue = value as string;
        const escapedValue = stringValue.replace(/"/g, '""');
        if (escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.includes('"')) {
          value = `"${escapedValue}"`;
        } else {
          value = escapedValue;
        }
      }

      return value;
    }).join(',');
  });


  return [header, ...rows].join('\n');
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
