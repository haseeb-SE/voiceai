import path from "path"
import fs from "fs"
import os from "os"

const isWindows = os.platform() === "win32"

/**
 * Ensures a binary path is valid and executable
 * @param binPath Path to the binary
 * @param fallbackName Fallback binary name to use if path is invalid
 * @returns Valid path or fallback name
 */
export function ensureValidBinaryPath(binPath: string | undefined, fallbackName: string): string {
  if (!binPath) {
    console.log(`Binary not found at expected paths, falling back to: ${fallbackName}`)
    return fallbackName
  }

  try {
    // Check if the file exists and is executable
    fs.accessSync(binPath, fs.constants.X_OK)
    return binPath
  } catch (error) {
    console.log(`Binary not found at expected paths, falling back to: ${fallbackName}`)
    return fallbackName
  }
}

/**
 * Normalizes a path for the current OS
 */
export function normalizePath(inputPath: string): string {
  if (isWindows) {
    // On Windows, ensure paths with spaces are properly quoted
    return path.normalize(inputPath)
  }
  return inputPath
}
