#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

cd "$REPO_ROOT"

echo "Repo root:"
pwd

TAG_NAME="${CI_TAG:-}"

if [ -n "$TAG_NAME" ]; then
  VERSION="${TAG_NAME#v}"
  BUILD_NUMBER="${CI_BUILD_NUMBER:-1}"

  echo "Syncing Xcode version to $VERSION build $BUILD_NUMBER"

  PROJECT_FILE="apps/safari/Onshape Plus/Onshape Plus.xcodeproj/project.pbxproj"

  sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PROJECT_FILE"
  sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"
else
  echo "No CI_TAG found; skipping Xcode version sync."
fi

echo "Installing dependencies..."
npm ci

echo "Building web extension..."
npm run build

echo "Verifying dist output..."
test -d dist
test -f dist/manifest.json
test -d dist/assets

echo "Pre-Xcodebuild setup complete."