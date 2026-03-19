/**
 * Utility for the useCommandBuilder hook (renderer-side quoting).
 * Mirrors the logic in electron/utils/pathSanitizer.ts but for display purposes.
 */
export function quoteArg(arg: string): string {
  if (!arg) return '""'
  if (/[\s[\]()^&|<>;`']/.test(arg)) {
    return `"${arg.replace(/"/g, '\\"')}"`
  }
  return arg
}
