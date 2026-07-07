export function toTitleCase(str: any) {
  try {
    return str
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  } catch (error) {
    return str
  }
}
