#!/bin/sh
set -e

cd "$CI_WORKSPACE"

TAG_NAME="${CI_TAG:-}"

if [ -n "$TAG_NAME" ]; then
  VERSION="${TAG_NAME#v}"
  BUILD_NUMBER="${CI_BUILD_NUMBER:-1}"

  echo "Syncing Xcode version to $VERSION build $BUILD_NUMBER"

  PROJECT_FILE="apps/safari/Onshape Plus/Onshape Plus.xcodeproj/project.pbxproj"

  sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PROJECT_FILE"
  sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"
fi

echo "Installing dependencies..."
npm ci

echo "Building web extension..."
npm run build

echo "Copying built extension assets into Safari extension resources..."

RESOURCE_DIR="apps/safari/Onshape Plus/Shared (Extension)/Resources"

rm -rf "$RESOURCE_DIR/assets" "$RESOURCE_DIR/icons"
rm -f "$RESOURCE_DIR/manifest.json" "$RESOURCE_DIR/onshape-page-bridge.js"

mkdir -p "$RESOURCE_DIR"

cp -R dist/assets "$RESOURCE_DIR/assets"
cp -R dist/icons "$RESOURCE_DIR/icons"
cp dist/manifest.json "$RESOURCE_DIR/manifest.json"
cp dist/onshape-page-bridge.js "$RESOURCE_DIR/onshape-page-bridge.js"

echo "Verifying copied Safari extension assets..."

test -d "$RESOURCE_DIR/assets"
test -d "$RESOURCE_DIR/icons"
test -f "$RESOURCE_DIR/manifest.json"
test -f "$RESOURCE_DIR/onshape-page-bridge.js"

echo "Safari extension assets ready."
