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

  test -f "$PROJECT_FILE"

  sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PROJECT_FILE"
  sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"
else
  echo "No CI_TAG found; skipping Xcode version sync."
fi

echo "Setting up Node..."

test -f ".nvmrc"

NODE_VERSION="$(cat .nvmrc | tr -d '[:space:]')"
NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"

echo "Requested Node version: $NODE_VERSION"
echo "Homebrew Node formula: node@$NODE_MAJOR"

export HOMEBREW_NO_AUTO_UPDATE=1

if ! command -v node >/dev/null 2>&1; then
  echo "Node not found. Installing node@$NODE_MAJOR..."
  brew install "node@$NODE_MAJOR"
fi

export PATH="/opt/homebrew/opt/node@$NODE_MAJOR/bin:/usr/local/opt/node@$NODE_MAJOR/bin:$PATH"

echo "Node path:"
which node

echo "npm path:"
which npm

echo "Node version:"
node -v

echo "npm version:"
npm -v

echo "Installing dependencies..."
npm ci

echo "Building web extension..."
npm run build

echo "Verifying dist output..."
test -d dist
test -f dist/manifest.json
test -d dist/assets

echo "Pre-Xcodebuild setup complete."