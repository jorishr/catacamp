#!/bin/sh
echo -e "\033[1;36m-----------------------------------"
echo -e "| Deploying the latest Catacamp release... |"
echo -e "-----------------------------------\033[0m\n"

set -e

# Stop exisiting processes
echo -e "=== Stop process of existing application... ===\n"

pm2 stop catacamp
wait $!

echo -e "=== \033[32m✓ Process halted gracefully. ===\033[0m\n"

echo -e "=== Start backup existing files... ===\n"

# Backup existing files
DIR_PATH_BASE="<enter-base-folder>"
BACKUP_FOLDER="$DIR_PATH_BASE/backup/backup*$(date +%Y-%m-%d_%H-%M)"
mkdir -p "$BACKUP_FOLDER"

if cp -r "$DIR_PATH_BASE"/dist "$BACKUP_FOLDER" && cp -r "$DIR_PATH_BASE"/node_modules "$BACKUP_FOLDER"; then
echo -e "\033[32m✓ Backup completed\033[0m\n"
else
echo -e "\033[1;31m✗ Error: backup failed.\033[0m\n"
fi

# Start clean
echo -e "=== Start clean: removing existing files... ===\n"
if rm -r "$DIR_PATH_BASE"/dist && rm -r "$DIR_PATH_BASE"/node_modules; then
echo -e "\033[32m✓ Done removing existing folders.\033[0m\n"
else
echo -e "\033[1;31m✗ Error: Error while removing existing folders.\033[0m\n"
fi

# Clone repo and build files
echo -e "=== Start cloning Github repo... ===\n"
GITHUB_REPO_URL="<enter-repo-github-link>"
NEW_RELEASE_FOLDER="$DIR_PATH_BASE"/new-release
git clone "$GITHUB_REPO_URL" "$NEW_RELEASE_FOLDER"

echo -e "=== Starting npm install & build process... ===\n"
cp "$DIR_PATH_BASE"/.env "$NEW_RELEASE_FOLDER"
cd "$NEW_RELEASE_FOLDER"
RECOMMENDED_NODE_VERSION=$(jq -r '.engines.node' package.json)
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
nvm install "$RECOMMENDED_NODE_VERSION"
nvm use "$RECOMMENDED_NODE_VERSION"
npm install
npm run build
wait $!
echo -e "=== \033[32m✓ Build process completed ===\033[0m\n"

# Copy files
echo -e "=== Copying files to final destination folder... ===\n"
if cp -r "$NEW_RELEASE_FOLDER"/dist "$DIR_PATH_BASE" && cp -r "$NEW_RELEASE_FOLDER"/node_modules "$DIR_PATH_BASE"; then
echo -e "=== \033[32m✓ Files copied to final destination. ===\033[0m\n"
else
echo -e "\033[1;31m✗ Error: Error while copying files to final destination.\033[0m\n"
fi

# Restart the app
echo -e "=== Starting the app... ===\n"
nvm use default
pm2 restart catacamp
wait $!
echo -e "=== \033[32m✓ App process started by PM2. ===\033[0m\n"

# Clean up temporary files
echo -e "=== Clean up... ===\n"
if rm -rf "$NEW_RELEASE_FOLDER"; then
echo -e "\033[32m✓ Clean up completed.\033[0m\n"
else
echo -e "\033[1;31m✗ Error: Error while cleaning up.\033[0m\n"
fi
echo -e "\033[1;32m---------------------------------------"
echo -e "| ✓ New release deployed succesfully! |"
echo -e "---------------------------------------\033[0m\n"
