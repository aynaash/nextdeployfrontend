#!/usr/bin/env bash

# NextDeploy Daemon Installer
# Version: 1.0
# Description: Safe installation script for nextdeployd v0.3.0 on Linux systems

set -euo pipefail  # Exit on error, undefined variable, or pipe failure

# Configuration
readonly VERSION="v0.3.0"
readonly BINARY_NAME="nextdeployd"
readonly TARGET_BINARY="/usr/local/bin/${BINARY_NAME}"
readonly DOWNLOAD_URL="https://github.com/aynaash/NextDeploy/releases/download/${VERSION}/nextdeployd-linux-amd64"
readonly CHECKSUM_URL="${DOWNLOAD_URL}.sha256"
readonly EXPECTED_CHECKSUM="00a47ddccb742a4038375f9c38e82c0710fc7f7e9bedd2908115e65c62ee32c4"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if run as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. This is required for system-wide installation."
    else
        log_error "This script must be run as root for system-wide installation."
        log_error "Please run: sudo $0"
        exit 1
    fi
}

# Check for required tools
check_dependencies() {
    local dependencies=("wget" "sha256sum" "mkdir" "chmod" "chown")
    local missing=()

    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing[*]}"
        exit 1
    fi
}

# Create temporary directory with safe permissions
create_temp_dir() {
    local temp_dir
    temp_dir=$(mktemp -d -t nextdeployd-install.XXXXXX)
    chmod 700 "$temp_dir"
    echo "$temp_dir"
}

# Download file with error handling
download_file() {
    local url=$1
    local output=$2
    local description=$3

    log_info "Downloading ${description}..."
    if ! wget --quiet --show-progress -O "$output" "$url"; then
        log_error "Failed to download ${description} from ${url}"
        exit 1
    fi
}

# Verify checksum
verify_checksum() {
    local file_path=$1
    local expected_checksum=$2

    log_info "Verifying checksum..."
    local actual_checksum
    actual_checksum=$(sha256sum "$file_path" | cut -d' ' -f1)

    if [[ "$actual_checksum" != "$expected_checksum" ]]; then
        log_error "Checksum verification failed!"
        log_error "Expected: ${expected_checksum}"
        log_error "Got:      ${actual_checksum}"
        log_error "The downloaded file may be corrupted or tampered with."
        exit 1
    fi
    log_info "Checksum verified successfully."
}

# Install binary
install_binary() {
    local source_path=$1
    local target_path=$2

    log_info "Installing binary to ${target_path}..."
    if ! mv "$source_path" "$target_path"; then
        log_error "Failed to move binary to ${target_path}"
        exit 1
    fi

    if ! chmod 755 "$target_path"; then
        log_error "Failed to set executable permissions"
        exit 1
    fi

    # Set appropriate ownership (root:root for system daemon)
    chown root:root "$target_path"
}

# Cleanup function
cleanup() {
    if [[ -n "${temp_dir:-}" && -d "$temp_dir" ]]; then
        rm -rf "$temp_dir"
    fi
}

# Main installation function
main_install() {
    log_info "Starting NextDeploy Daemon ${VERSION} installation..."

    check_root
    check_dependencies

    # Create temporary directory
    temp_dir=$(create_temp_dir)
    local download_path="${temp_dir}/${BINARY_NAME}"
    local checksum_path="${download_path}.sha256"

    # Set up cleanup trap
    trap cleanup EXIT

    # Download and verify
    download_file "$DOWNLOAD_URL" "$download_path" "nextdeployd binary"
    verify_checksum "$download_path" "$EXPECTED_CHECKSUM"

    # Install
    install_binary "$download_path" "$TARGET_BINARY"

    # Verify final installation
    if [[ -x "$TARGET_BINARY" ]]; then
        local installed_version
        if installed_version=$("$TARGET_BINARY" --version 2>/dev/null); then
            log_info "Successfully installed: ${installed_version}"
        else
            log_info "Successfully installed ${BINARY_NAME} to ${TARGET_BINARY}"
        fi
    else
        log_error "Installation completed but binary not found or not executable"
        exit 1
    fi

    log_info "Installation completed successfully!"
}

# Usage information
show_usage() {
    cat << EOF
NextDeploy Daemon Installer

Usage: sudo $0

This script will:
1. Download nextdeployd v0.3.0 from GitHub releases
2. Verify the SHA256 checksum for security
3. Install to /usr/local/bin/nextdeployd
4. Set appropriate permissions

Security Notes:
- Requires root privileges for system-wide installation
- Verifies cryptographic checksum to ensure file integrity
- Uses temporary directory with restricted permissions
- Cleans up all temporary files after installation

EOF
}

# Argument parsing
case "${1:-}" in
    -h|--help)
        show_usage
        exit 0
        ;;
    "")
        main_install
        ;;
    *)
        log_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac
