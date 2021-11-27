set -e

# Builds, installs to `example` folder and runs the library

runCommand() {
  echo "=== $1 ==="
  $1
  echo ""
}

runCommand "npm run clean"
runCommand "npm run build"
runCommand "npx preview"
runCommand "{{ toolName }}"
