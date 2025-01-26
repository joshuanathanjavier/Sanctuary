type SeverityLevel = "Normal" | "Mild" | "Moderate" | "Severe" | "Extremely Severe"

export function recommendGenres(depression: SeverityLevel, anxiety: SeverityLevel, stress: SeverityLevel): string[] {
  const severityOrder = ["Normal", "Mild", "Moderate", "Severe", "Extremely Severe"]
  const maxSeverity = Math.max(
    severityOrder.indexOf(depression),
    severityOrder.indexOf(anxiety),
    severityOrder.indexOf(stress),
  )

  const primaryGenre = getPrimaryGenre(maxSeverity)
  const secondaryGenres = getSecondaryGenres(primaryGenre)

  return [primaryGenre, ...secondaryGenres]
}

function getPrimaryGenre(maxSeverity: number): string {
  switch (maxSeverity) {
    case 0: // Normal
      return "Lofi"
    case 1: // Mild
      return "Instrumental"
    case 2: // Moderate
      return "Ambient"
    case 3: // Severe
      return "Nature"
    case 4: // Extremely-Severe
      return "Atmospheric"
    default:
      return "Lofi"
  }
}

function getSecondaryGenres(primaryGenre: string): string[] {
  const allGenres = ["Lofi", "Instrumental", "Ambient", "Nature", "Atmospheric", "Sentimental", "Magnificent"]
  const secondaryGenres = allGenres.filter((genre) => genre !== primaryGenre)
  return secondaryGenres.slice(0, 3) // Return 3 secondary genres
}

