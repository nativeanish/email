type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  // Initialize an empty array to store valid class names
  const classes: string[] = []

  // Process each input
  for (const input of inputs) {
    // Skip falsy values (null, undefined, false, 0, '')
    if (!input) continue

    // Handle different types of inputs
    const type = typeof input

    if (type === "string" || type === "number") {
      // If input is a string or number, add it directly
      classes.push(input.toString())
    } else if (Array.isArray(input)) {
      // If input is an array, recursively process it and add the result
      const nestedClasses = cn(...input)
      if (nestedClasses) {
        classes.push(nestedClasses)
      }
    } else if (type === "object") {
      if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
        for (const key in input) {
          if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
            classes.push(key)
          }
        }
      }

    }
    // Ignore other types
  }

  // Join all classes with a space and return
  return classes.join(" ")
}
