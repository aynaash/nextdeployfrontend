#!/bin/bash
set -e

mkdir -p ~/.local/bin

# Fetch latest release version from GitHub
VERSION=$(curl -s https://api.github.com/repos/aynaash/NextDeploy/releases/latest | jq -r .tag_name)

OS="$(uname | tr '[:upper:]' '[:lower:]')"
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; fi
if [ "$ARCH" = "arm64" ]; then ARCH="arm64"; fi

# Download binary
curl -L "https://github.com/aynaash/NextDeploy/releases/download/${VERSION}/nextdeploy-${OS}-${ARCH}" -o ~/.local/bin/nextdeploy
chmod +x ~/.local/bin/nextdeploy

# Detect shell and update the correct profile
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.profile"
fi

# Ensure ~/.local/bin is in PATH
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$SHELL_RC"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_RC"
fi

# Reload shell config
source "$SHELL_RC"

# Verify installation
echo "✅ NextDeploy installed successfully!"
nextdeploy --help || echo "Please restart your shell or run: export PATH=\"$HOME/.local/bin:\$PATH\""
