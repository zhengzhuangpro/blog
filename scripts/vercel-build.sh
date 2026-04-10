#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=".vercel/output/static"
ARCHIVE_PATH=".vercel/output/export.zip"

pnpm run mintlify:sync
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

pnpm dlx mintlify export --output "$ARCHIVE_PATH"
unzip -q -o "$ARCHIVE_PATH" -d "$OUT_DIR"

# Remove air-gap helper files not needed for Vercel static hosting.
rm -f \
  "$OUT_DIR/export.zip" \
  "$OUT_DIR/Start Docs.bat" \
  "$OUT_DIR/Start Docs.command" \
  "$OUT_DIR/serve.js" \
  "$OUT_DIR/.gitignore"
rm -rf "$OUT_DIR/scripts" "$OUT_DIR/snippets"
