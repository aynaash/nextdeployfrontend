#!/bin/bash
mkdir -p ~/.local/bin

# Fetch latest release version from GitHub
VERSION=$(curl -s https://api.github.com/repos/aynaash/NextDeploy/releases/latest | jq -r .tag_name)

OS="darwin"
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; fi
if [ "$ARCH" = "arm64" ]; then ARCH="arm64"; fi

# Download binary into ~/.local/bin
curl -L "https://github.com/aynaash/NextDeploy/releases/download/${VERSION}/nextdeploy-${OS}-${ARCH}" -o ~/.local/bin/nextdeploy
chmod +x ~/.local/bin/nextdeploy

# Ensure ~/.local/bin is in PATH (for zsh, default on macOS)
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' ~/.zshrc; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
fi
source ~/.zshrc

# Verify installation
nextdeploy
