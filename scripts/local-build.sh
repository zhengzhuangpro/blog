#!/usr/bin/env bash
set -euo pipefail

# 本地构建脚本：导出 Mintlify 静态文件，准备 Vercel 部署
OUT_DIR=".vercel/output/static"
ARCHIVE_PATH=".vercel/output/export.zip"

echo "Cleaning previous build..."
rm -rf "$OUT_DIR" export.zip
mkdir -p "$OUT_DIR"

echo "Syncing docs.json..."
pnpm run mintlify:sync

echo "Exporting Mintlify site..."
npx --yes mintlify export --output "$ARCHIVE_PATH"

echo "Extracting..."
unzip -q -o "$ARCHIVE_PATH" -d "$OUT_DIR"

# Remove unnecessary files
rm -f \
  "$OUT_DIR/export.zip" \
  "$OUT_DIR/Start Docs.bat" \
  "$OUT_DIR/Start Docs.command" \
  "$OUT_DIR/serve.js" \
  "$OUT_DIR/.gitignore"
rm -rf "$OUT_DIR/scripts" "$OUT_DIR/snippets"

echo "Build complete. Output size: $(du -sh "$OUT_DIR" | cut -f1)"
echo "Run 'npx vercel deploy --prebuilt' to deploy."
