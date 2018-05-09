#!/usr/bin/env bash
# This bash file will deploy the build folder to the project gh-page
set -e

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

# Destination directory for built code
BUILDDIR="$BASEDIR/build"

# make folder and copy files
mkdir "$BUILDDIR"

cp "$BASEDIR/index.html" "$BUILDDIR"
cp "$BASEDIR/example.html" "$BUILDDIR"
cp "$BASEDIR/bower.json" "$BUILDDIR"
cp "$BASEDIR/.bowerrc" "$BUILDDIR"
cp  -R "$BASEDIR/img" "$BUILDDIR"
cp  -R "$BASEDIR/src" "$BUILDDIR"

# Create a new Git repo in build folder
cd "$BUILDDIR"
bower install
git init

# Set user details
git config user.name "iAyeBot"
git config user.email "iayebot@websemantics.ca"

# First commit, .. horray!
git add .
git commit -m "Deploy to gh-pages"

# Force push ...
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
