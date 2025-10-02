/**
 * Generate category path
 */
export function categoryPath(categoryId: string): string {
  return `/${categoryId}`
}

/**
 * Generate tile detail path
 */
export function tilePath(categoryId: string, tileId: string): string {
  return `/${categoryId}/${tileId}`
}

/**
 * Generate dashboard path
 */
export function dashboardPath(): string {
  return '/'
}

