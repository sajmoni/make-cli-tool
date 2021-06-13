set -e

# Builds, installs to `example` folder and runs the library

runCommand() {
  echo "=== $1 ==="
  $1
  echo ""
}

runCommand "yarn clean"
runCommand "yarn build"
runCommand "yarn pack --filename make-cli-tool.tgz"
runCommand "cd example"
runCommand "yarn refresh"
runCommand "yarn make-cli-tool test-tool"
