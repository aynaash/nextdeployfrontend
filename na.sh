#!/bin/bash
# nuke-daemon.sh - Completely remove NextDeploy daemon from the system

set -e  # Exit on any error

echo "🚀 Starting NextDeploy daemon nuke procedure..."
echo "=============================================="

# Stop and disable the service
if systemctl is-active --quiet nextdeployd; then
    echo "🛑 Stopping nextdeployd service..."
    sudo systemctl stop nextdeployd
fi

if systemctl is-enabled --quiet nextdeployd; then
    echo "🔌 Disabling nextdeployd service..."
    sudo systemctl disable nextdeployd
fi

# Remove service file
if [ -f "/etc/systemd/system/nextdeployd.service" ]; then
    echo "🗑️ Removing service file..."
    sudo rm -f /etc/systemd/system/nextdeployd.service
fi

# Remove binary
if [ -f "/usr/local/bin/nextdeployd" ]; then
    echo "🗑️ Removing binary..."
    sudo rm -f /usr/local/bin/nextdeployd
fi

# Remove socket file
if [ -S "/var/run/nextdeployd.sock" ]; then
    echo "🗑️ Removing socket file..."
    sudo rm -f /var/run/nextdeployd.sock
fi

# Remove log directory (optional - be careful with this)
if [ -d "/var/log/nextdeployd" ]; then
    echo "⚠️ Log directory found at /var/log/nextdeployd"
    read -p "❓ Remove log directory? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️ Removing log directory..."
        sudo rm -rf /var/log/nextdeployd
    else
        echo "📁 Keeping log directory"
    fi
fi

# Remove config directory (optional)
if [ -d "/etc/nextdeployd" ]; then
    echo "⚠️ Config directory found at /etc/nextdeployd"
    read -p "❓ Remove config directory? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️ Removing config directory..."
        sudo rm -rf /etc/nextdeployd
    else
        echo "📁 Keeping config directory"
    fi
fi

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload
sudo systemctl reset-failed

# Kill any remaining processes
echo "🔫 Killing any remaining nextdeployd processes..."
sudo pkill -f "nextdeployd" || true
sudo pkill -f "/usr/local/bin/nextdeployd" || true

# Clean up any dangling containers (optional)
echo "🐳 Checking for NextDeploy containers..."
CONTAINERS=$(sudo docker ps -a --filter "name=nextdeploy" --format "{{.Names}}" 2>/dev/null || true)

if [ ! -z "$CONTAINERS" ]; then
    echo "⚠️ Found NextDeploy containers:"
    echo "$CONTAINERS"
    read -p "❓ Remove these containers? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️ Removing containers..."
        sudo docker rm -f $(sudo docker ps -a --filter "name=nextdeploy" --format "{{.Names}}") 2>/dev/null || true
    else
        echo "🐋 Keeping containers"
    fi
fi

echo "✅ NextDeploy daemon nuked successfully!"
echo "========================================"

# Final verification
echo "🔍 Final verification:"
if ! systemctl is-active --quiet nextdeployd; then
    echo "✅ Service is not running"
else
    echo "❌ Service is still running (this shouldn't happen)"
fi

if [ ! -f "/usr/local/bin/nextdeployd" ]; then
    echo "✅ Binary removed"
else
    echo "❌ Binary still exists"
fi

if [ ! -f "/etc/systemd/system/nextdeployd.service" ]; then
    echo "✅ Service file removed"
else
    echo "❌ Service file still exists"
fi

echo "🎉 Nuke procedure complete!"
