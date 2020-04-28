set -e

# Builds, installs to `example` folder and runs the library

runCommand() {
  echo "=== $1 ==="
  $1
  echo ""
}

runCommand "yarn clean"
runCommand "yarn build"
runCommand "yarn pack --filename {{ toolName }}.tgz"
runCommand "cd example"
runCommand "yarn refresh"
runCommand "yarn {{ toolName }}"
