#!/bin/sh
set -e

cd "$CI_WORKSPACE"

TAG_NAME="${CI_TAG:-}"

if [ -z "$TAG_NAME" ]; then
  echo "No CI_TAG found. Skipping version sync."
else
  VERSION="${TAG_NAME#v}"
  BUILD_NUMBER="${CI_BUILD_NUMBER:-1}"

  echo "Syncing Xcode version to $VERSION build $BUILD_NUMBER"

  PROJECT_FILE="apps/safari/Onshape Plus/Onshape Plus.xcodeproj/project.pbxproj"

  sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $VERSION;/g" "$PROJECT_FILE"
  sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"
fi

npm ci
npm run build
