runCommand() {
  echo "=== $1 ==="
  $1
  echo ""
}


# TODO: Run this every time before release
# TODO: Test all error cases

echo ""
echo "=== Run normally ==="
echo ""
runCommand "yarn make-cli-tool test-tool"
runCommand "cd test-tool"
runCommand "yarn go"
echo "=== Error: Project folder already exists ==="
echo ""
runCommand "cd .."
runCommand "yarn make-cli-tool test-tool"
echo "=== Error: No name provided ==="
echo ""
runCommand "yarn make-cli-tool"
echo "=== --use-ink ==="
echo ""
runCommand "yarn make-cli-tool ink-tool --use-ink"
runCommand "cd ink-tool"
runCommand "yarn go"
