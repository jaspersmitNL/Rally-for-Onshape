#!/bin/sh
set -e

echo "Building Safari extension assets..."

cd "$CI_WORKSPACE"

TAG_NAME="${CI_TAG:-}"

if [ -n "$TAG_NAME" ]; then
  VERSION="${TAG_NAME#v}"
  BUILD_NUMBER="${CI_BUILD_NUMBER:-1}"

  echo "Syncing Xcode version to $VERSION build $BUILD_NUMBER"

  PROJECT_FILE="apps/safari/Onshape Plus/Onshape Plus.xcodeproj/project.pbxproj"

  sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PROJECT_FILE"
  sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"
else
  echo "No CI_TAG found. Skipping version sync."
fi

npm ci
npm run build

echo "Verifying Safari extension assets..."

test -f dist/manifest.json
test -f dist/onshape-page-bridge.js
test -d dist/assets
test -d dist/icons

echo "Safari extension assets built successfully."
