#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=".vercel/output/static"
ARCHIVE_PATH=".vercel/output/export.zip"

echo "vercel-build commit: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

# Clean previous build artifacts
rm -rf "$OUT_DIR" export.zip
mkdir -p "$OUT_DIR"

# Sync docs.json
pnpm run mintlify:sync

# Export Mintlify static files with retry
MAX_RETRIES=3
RETRY_COUNT=0
until [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
  echo "Export attempt $((RETRY_COUNT + 1)) of $MAX_RETRIES..."
  if npx --yes mintlify export --output "$ARCHIVE_PATH"; then
    echo "Export succeeded."
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "Export failed, retrying in 10s..."
    sleep 10
  else
    echo "Export failed after $MAX_RETRIES attempts."
    exit 1
  fi
done

# Extract exported files
unzip -q -o "$ARCHIVE_PATH" -d "$OUT_DIR"

# Remove air-gap helper files not needed for Vercel static hosting
rm -f \
  "$OUT_DIR/export.zip" \
  "$OUT_DIR/Start Docs.bat" \
  "$OUT_DIR/Start Docs.command" \
  "$OUT_DIR/serve.js" \
  "$OUT_DIR/.gitignore"
rm -rf "$OUT_DIR/scripts" "$OUT_DIR/snippets"

echo "Build complete. Output size: $(du -sh "$OUT_DIR" | cut -f1)"
