# TODO: Run this every time before release
# TODO: Test all error cases

echo ""
echo "=== Run normally ==="
echo ""
yarn make-cli-tool test-tool
echo ""
echo "=== Error: Project folder already exists ==="
echo ""
yarn make-cli-tool test-tool
echo ""
echo "=== Error: No name provided ==="
echo ""
yarn make-cli-tool
echo ""
