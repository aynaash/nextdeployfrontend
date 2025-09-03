#!/bin/bash
# Install to ~/.local/bin instead (no sudo needed)
mkdir -p ~/.local/bin
VERSION=$(curl -s https://api.github.com/repos/aynaash/NextDeploy/releases/latest | jq -r .tag_name)
OS="linux"
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; fi
if [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; fi

curl -L "https://github.com/aynaash/NextDeploy/releases/download/${VERSION}/nextdeploy-${OS}-${ARCH}" -o ~/.local/bin/nextdeploy
chmod +x ~/.local/bin/nextdeploy

# Add to PATH if not already there
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
nextdeploy --version
