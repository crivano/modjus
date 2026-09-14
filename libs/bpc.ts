// Formula per Annexo: (sum / (n×4)) × 100 - 0.1
export const qualificadorFinalLetter = (values: (string | null | undefined)[]): string => {
    const validValues = values
        .filter(v => v !== undefined && v !== null && v !== '')
        .map(Number)
    if (validValues.length === 0) return '—'
    const sum = validValues.reduce((a, b) => a + b, 0)
    const pct = (sum / (validValues.length * 4)) * 100 - 0.1
    if (pct <= 5) return 'N'
    else if (pct <= 25) return 'L'
    else if (pct <= 50) return 'M'
    else if (pct <= 99) return 'G'
    else return 'C'
}