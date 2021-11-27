set -e

runCommand() {
  echo "=== $1 ==="
  $1
  echo ""
}

runCommand "npm run clean"
runCommand "npm run build"
runCommand "npx preview"
runCommand "npx make-cli-tool test-tool"
runCommand "cd test-tool"
runCommand "npm run go"
