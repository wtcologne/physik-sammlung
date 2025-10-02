export const categoryColors = {
  mechanik: {
    gradient: 'from-blue-500 to-cyan-500',
    primary: 'text-blue-600 dark:text-blue-400',
    primaryBg: 'bg-blue-600 dark:bg-blue-500',
    secondary: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800',
    ring: 'focus:ring-blue-500',
    accent: 'bg-blue-100 dark:bg-blue-900/50',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/50',
  },
  optik: {
    gradient: 'from-purple-500 to-pink-500',
    primary: 'text-purple-600 dark:text-purple-400',
    primaryBg: 'bg-purple-600 dark:bg-purple-500',
    secondary: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800',
    ring: 'focus:ring-purple-500',
    accent: 'bg-purple-100 dark:bg-purple-900/50',
    hover: 'hover:bg-purple-50 dark:hover:bg-purple-950/50',
  },
  elektrizitaetslehre: {
    gradient: 'from-amber-500 to-orange-500',
    primary: 'text-amber-600 dark:text-amber-400',
    primaryBg: 'bg-amber-600 dark:bg-amber-500',
    secondary: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800',
    ring: 'focus:ring-amber-500',
    accent: 'bg-amber-100 dark:bg-amber-900/50',
    hover: 'hover:bg-amber-50 dark:hover:bg-amber-950/50',
  },
} as const

export type CategoryId = keyof typeof categoryColors

export function getCategoryColors(categoryId: string) {
  return categoryColors[categoryId as CategoryId] || categoryColors.mechanik
}

export function getCategoryGradient(categoryId: string) {
  return getCategoryColors(categoryId).gradient
}
