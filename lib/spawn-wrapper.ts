import { spawn as nodeSpawn, type SpawnOptions } from "child_process"
import os from "os"

const isWindows = os.platform() === "win32"

/**
 * A wrapper around Node's spawn function that handles Windows-specific issues
 */
export function safeSpawn(command: string, args: string[], options?: SpawnOptions) {
  // Normalize the command path
  const normalizedCommand = isWindows ? command.replace(/\\/g, "\\\\") : command

  // On Windows, we need to use shell: true for executables with spaces in their path
  if (isWindows) {
    // Check if the command is a path or just a command name
    const isPath = normalizedCommand.includes("/") || normalizedCommand.includes("\\")

    // If it's a path, make sure it's properly quoted
    const finalCommand = isPath ? `"${normalizedCommand}"` : normalizedCommand

    return nodeSpawn(finalCommand, args, {
      ...options,
      shell: true,
      windowsVerbatimArguments: true,
    })
  }

  // On other platforms, use normal spawn
  return nodeSpawn(normalizedCommand, args, options)
}
