type SeverityLevel = "Normal" | "Mild" | "Moderate" | "Severe" | "Extremely Severe"

export function recommendGenres(depression: SeverityLevel, anxiety: SeverityLevel, stress: SeverityLevel): string[] {
  const depressionGenres = getGenresForCondition(depression, "depression")
  const anxietyGenres = getGenresForCondition(anxiety, "anxiety")
  const stressGenres = getGenresForCondition(stress, "stress")

  return [...depressionGenres, ...anxietyGenres, ...stressGenres]
}

function getGenresForCondition(severity: SeverityLevel, condition: "depression" | "anxiety" | "stress"): string[] {
  const primaryGenre = getPrimaryGenre(severity, condition)
  const secondaryGenres = getSecondaryGenres(primaryGenre, condition)
  return [primaryGenre, ...secondaryGenres]
}

function getPrimaryGenre(severity: SeverityLevel, condition: "depression" | "anxiety" | "stress"): string {
  const genreMap = {
    depression: {
      Normal: "Lofi",
      Mild: "Instrumental",
      Moderate: "Ambient",
      Severe: "Nature",
      "Extremely Severe": "Atmospheric",
    },
    anxiety: {
      Normal: "Lofi",
      Mild: "Nature",
      Moderate: "Ambient",
      Severe: "Atmospheric",
      "Extremely Severe": "Instrumental",
    },
    stress: {
      Normal: "Lofi",
      Mild: "Nature",
      Moderate: "Instrumental",
      Severe: "Ambient",
      "Extremely Severe": "Atmospheric",
    },
  }

  return genreMap[condition][severity]
}

function getSecondaryGenres(primaryGenre: string, condition: "depression" | "anxiety" | "stress"): string[] {
  const allGenres = {
    depression: ["Lofi", "Instrumental", "Ambient", "Nature", "Atmospheric", "Sentimental", "Magnificent"],
    anxiety: ["Lofi", "Nature", "Ambient", "Atmospheric", "Instrumental", "Dark", "Energizing"],
    stress: ["Lofi", "Nature", "Instrumental", "Ambient", "Atmospheric", "Sentimental", "Magnificent"],
  }

  const secondaryGenres = allGenres[condition].filter((genre) => genre !== primaryGenre)
  return secondaryGenres.slice(0, 2) // Return 2 secondary genres (3 total with primary)
}

