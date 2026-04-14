#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="dist"
ARCHIVE_PATH="dist/export.zip"

echo "cloudflare-build commit: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

# Clean previous build artifacts
rm -rf "$OUT_DIR" export.zip
mkdir -p "$OUT_DIR"

# Sync docs.json
pnpm run mintlify:sync

# Export Mintlify static files
echo "Exporting Mintlify site..."
npx --yes mintlify export --output "$ARCHIVE_PATH"

# Extract
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

# Copy _headers for Cloudflare Pages
if [ -f "public/_headers" ]; then
  cp "public/_headers" "$OUT_DIR/_headers"
fi
if [ -f "public/_redirects" ]; then
  cp "public/_redirects" "$OUT_DIR/_redirects"
fi

echo "Build complete. Output size: $(du -sh "$OUT_DIR" | cut -f1)"
