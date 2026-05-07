#!/bin/bash
# NextDeploy Installation Script
# Secure, defensive, and production-ready

# ─── Bash re-exec shim ────────────────────────────────────────────────────────
# `curl … | sh` is muscle memory for many users, but this script uses bash-
# only features ([[ … ]], =~, arrays). When invoked under a POSIX shell, refetch
# the script and re-exec under bash so the user gets a working install instead
# of a parser error on line ~24. Skipped when already running under bash, so
# `bash install.sh` and local development work unchanged.
if [ -z "${BASH_VERSION:-}" ]; then
    if ! command -v bash >/dev/null 2>&1; then
        printf 'Error: NextDeploy installer requires bash.\n' >&2
        printf '  Debian/Ubuntu: sudo apt install bash\n' >&2
        printf '  macOS:         brew install bash\n' >&2
        exit 1
    fi
    _ND_URL='https://nextdeploy.org/install.sh'
    if command -v curl >/dev/null 2>&1; then
        exec bash -c "$(curl -fsSL "$_ND_URL")" _ "$@"
    elif command -v wget >/dev/null 2>&1; then
        exec bash -c "$(wget -qO- "$_ND_URL")" _ "$@"
    else
        printf 'Error: curl or wget is required to bootstrap the installer.\n' >&2
        exit 1
    fi
fi

set -euo pipefail

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ─── Configuration ─────────────────────────────────────────────────────────────
REPO="aynaash/NextDeploy"
BIN_NAME="nextdeploy"
INSTALL_DIR="/usr/local/bin"
DOWNLOAD_DIR="${HOME}/.nextdeploy/downloads"
GITHUB_API="https://api.github.com/repos/${REPO}/releases/latest"

# ─── Argument Parsing ──────────────────────────────────────────────────────────
TARGET_VERSION="${1:-}"

if [[ -n "$TARGET_VERSION" ]] && [[ ! "$TARGET_VERSION" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
    echo -e "${RED}Error: Invalid version format. Use: vX.Y.Z or X.Y.Z${NC}" >&2
    echo "Usage: $0 [version]" >&2
    exit 1
fi

# ─── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
    local exit_code=$?
    if [[ -n "${TMP_DIR:-}" ]] && [[ -d "${TMP_DIR}" ]]; then
        rm -rf "${TMP_DIR}"
    fi
    if [[ $exit_code -ne 0 ]]; then
        echo -e "${RED}❌ Installation failed (exit code: $exit_code)${NC}" >&2
    fi
    exit $exit_code
}
trap cleanup EXIT INT TERM

# ─── Helpers ───────────────────────────────────────────────────────────────────

# Verify required tools are available
check_dependencies() {
    local missing=()

    if command -v curl >/dev/null 2>&1; then
        DOWNLOADER="curl"
    elif command -v wget >/dev/null 2>&1; then
        DOWNLOADER="wget"
    else
        missing+=("curl or wget")
    fi

    if command -v sha256sum >/dev/null 2>&1; then
        CHECKSUM_TOOL="sha256sum"
    elif command -v shasum >/dev/null 2>&1; then
        CHECKSUM_TOOL="shasum"
    else
        missing+=("sha256sum or shasum")
    fi

    if command -v tar >/dev/null 2>&1; then
        : # tar is available
    else
        missing+=("tar")
    fi

    if [[ ! -w "$INSTALL_DIR" ]] && ! command -v sudo >/dev/null 2>&1; then
        missing+=("sudo (required to write to $INSTALL_DIR)")
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${RED}Error: Missing required dependencies:${NC}" >&2
        printf '  - %s\n' "${missing[@]}" >&2
        exit 1
    fi
}

# Unified download wrapper for curl/wget
download_file() {
    local url="$1"
    local output="${2:-}"

    if [[ "$DOWNLOADER" == "curl" ]]; then
        if [[ -n "$output" ]]; then
            curl -fsSL --connect-timeout 30 --retry 3 --retry-delay 2 -o "$output" "$url"
        else
            curl -fsSL "$url"
        fi
    else
        if [[ -n "$output" ]]; then
            wget -q --timeout=30 --tries=3 --retry-connrefused -O "$output" "$url"
        else
            wget -q -O - "$url"
        fi
    fi
}

# Compute sha256 checksum of a file
compute_checksum() {
    local file="$1"
    if [[ "$CHECKSUM_TOOL" == "sha256sum" ]]; then
        sha256sum "$file" | cut -d' ' -f1
    else
        shasum -a 256 "$file" | cut -d' ' -f1
    fi
}

# Fetch the latest release tag from GitHub
get_latest_version() {
    local api_response tag

    echo -e "${BLUE}📡 Fetching latest release info...${NC}" >&2

    if ! api_response=$(download_file "$GITHUB_API" ""); then
        echo -e "${RED}Error: Failed to reach GitHub API${NC}" >&2
        exit 1
    fi

    tag=$(echo "$api_response" | grep -o '"tag_name": *"[^"]*"' | cut -d'"' -f4)

    if [[ -z "$tag" ]]; then
        echo -e "${RED}Error: Could not parse version from GitHub response${NC}" >&2
        exit 1
    fi

    echo "$tag"  # Only this line goes to stdout — the caller captures just the tag
}

# Download and return the checksums file for a given release version
get_checksums() {
    local version="$1"
    local clean_version="${version#v}"
    local checksums_url="https://github.com/${REPO}/releases/download/${version}/nextdeploy_${clean_version}_checksums.txt"
    local checksums_file="${DOWNLOAD_DIR}/checksums-${version}.txt"

    mkdir -p "$DOWNLOAD_DIR"

    # Return cached copy if available
    if [[ -f "$checksums_file" ]]; then
        cat "$checksums_file"
        return 0
    fi

    echo -e "${BLUE}📋 Downloading checksums...${NC}" >&2
    if download_file "$checksums_url" "$checksums_file"; then
        cat "$checksums_file"
    else
        echo -e "${YELLOW}⚠️  Could not download checksums — skipping verification${NC}" >&2
        return 1
    fi
}

# Install a file to INSTALL_DIR, using sudo if required
install_file() {
    local src="$1"
    local dest="$2"

    if [[ -w "$INSTALL_DIR" ]]; then
        mv "$src" "$dest"
        chmod 755 "$dest"
    else
        echo -e "${YELLOW}⚠️  Sudo required to install to $INSTALL_DIR${NC}"
        sudo mv "$src" "$dest"
        sudo chmod 755 "$dest"
    fi
}

# ─── Main ──────────────────────────────────────────────────────────────────────
main() {
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${GREEN}   Installing NextDeploy CLI${NC}"
    echo -e "${BLUE}===========================================${NC}"
    echo ""

    check_dependencies

    # ── Detect platform ───────────────────────────────────────────────────────
    local os arch
    os="$(uname -s | tr '[:upper:]' '[:lower:]')"
    arch="$(uname -m)"

    case "$arch" in
        x86_64|amd64)   arch="amd64" ;;
        aarch64|arm64)  arch="arm64" ;;
        *)
            echo -e "${RED}Unsupported architecture: $arch${NC}" >&2
            exit 1
            ;;
    esac

    # Prefer native arm64 when running under Rosetta 2
    if [[ "$os" == "darwin" && "$arch" == "amd64" ]]; then
        if [[ "$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)" == "1" ]]; then
            echo -e "${YELLOW}⚠️  Rosetta 2 detected — downloading native arm64 binary${NC}"
            arch="arm64"
        fi
    fi

    case "$os" in
        darwin|linux) ;;
        *)
            echo -e "${RED}Unsupported OS: $os. Use install.bat on Windows.${NC}" >&2
            exit 1
            ;;
    esac

    echo -e "${GREEN}✓ Platform:${NC} ${os}/${arch}"

    # ── Resolve version ───────────────────────────────────────────────────────
    local version
    if [[ -n "$TARGET_VERSION" ]]; then
        # Normalise to vX.Y.Z
        version="v${TARGET_VERSION#v}"
        echo -e "${GREEN}✓ Target version:${NC} $version"
    else
        version="$(get_latest_version)"
        echo -e "${GREEN}✓ Latest version:${NC} $version"
    fi

    local clean_version="${version#v}"

    # ── Download archive ─────────────────────────────────────────────────────
    local archive_name download_url
    archive_name="nextdeploy_${clean_version}_${os}_${arch}.tar.gz"
    download_url="https://github.com/${REPO}/releases/download/${version}/${archive_name}"

    mkdir -p "$DOWNLOAD_DIR"
    TMP_DIR="$(mktemp -d "${DOWNLOAD_DIR}/install-XXXXXX")"
    local archive_path="${TMP_DIR}/${archive_name}"

    echo -e "${BLUE}📥 Downloading ${archive_name}...${NC}"
    if ! download_file "$download_url" "$archive_path"; then
        echo -e "${RED}Error: Download failed${NC}" >&2
        exit 1
    fi

    if [[ ! -s "$archive_path" ]]; then
        echo -e "${RED}Error: Downloaded file is empty${NC}" >&2
        exit 1
    fi

    # ── Verify checksum ───────────────────────────────────────────────────────
    local checksums
    if checksums="$(get_checksums "$version")"; then
        echo -e "${BLUE}🔒 Verifying checksum...${NC}"
        local expected actual
        expected="$(echo "$checksums" | grep "$archive_name" | awk '{print $1}')"

        if [[ -n "$expected" ]]; then
            actual="$(compute_checksum "$archive_path")"
            if [[ "$actual" != "$expected" ]]; then
                echo -e "${RED}Error: Checksum mismatch${NC}" >&2
                echo "  Expected: $expected" >&2
                echo "  Actual:   $actual" >&2
                exit 1
            fi
            echo -e "${GREEN}✓ Checksum verified${NC}"
        else
            echo -e "${YELLOW}⚠️  No checksum entry for $archive_name — skipping${NC}" >&2
        fi
    fi

    # ── Extract binary from archive ──────────────────────────────────────────
    echo -e "${BLUE}📦 Extracting binary...${NC}"
    tar -xzf "$archive_path" -C "$TMP_DIR"

    local extracted_bin="${TMP_DIR}/${BIN_NAME}"
    if [[ ! -f "$extracted_bin" ]]; then
        echo -e "${RED}Error: Binary '${BIN_NAME}' not found in archive${NC}" >&2
        exit 1
    fi

    # ── Validate binary ───────────────────────────────────────────────────────
    chmod +x "$extracted_bin"
    echo -e "${BLUE}🔍 Validating binary...${NC}"

    local reported_version
    reported_version="$("$extracted_bin" version 2>/dev/null || true)"

    if echo "$reported_version" | grep -qF "$clean_version"; then
        echo -e "${GREEN}✓ Binary OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Version mismatch — binary reports: ${reported_version:-unknown}${NC}" >&2
    fi

    # ── Install ───────────────────────────────────────────────────────────────
    local dest="${INSTALL_DIR}/${BIN_NAME}"

    # Back up any existing installation
    if [[ -f "$dest" ]]; then
        local backup="${dest}.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${YELLOW}⚠️  Backing up existing binary → $backup${NC}"
        if [[ -w "$INSTALL_DIR" ]]; then
            mv "$dest" "$backup"
        else
            sudo mv "$dest" "$backup"
        fi
    fi

    echo -e "${BLUE}📦 Installing to ${dest}...${NC}"
    install_file "$extracted_bin" "$dest"

    # Bust shell command cache so the new binary is found immediately
    hash -r 2>/dev/null || true

    # ── Final check ───────────────────────────────────────────────────────────
    local installed_version
    installed_version="$("$dest" version 2>/dev/null || echo "unknown")"

    echo ""
    echo -e "${GREEN}===========================================${NC}"
    echo -e "${GREEN}✅ NextDeploy ${installed_version} installed successfully!${NC}"
    echo -e "${GREEN}===========================================${NC}"
    echo ""
    echo -e "  Run:  ${YELLOW}nextdeploy --help${NC}"
    echo -e "  Docs: ${BLUE}https://nextdeploy.org/docs${NC}"
    echo ""

    if ! command -v "$BIN_NAME" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  '$BIN_NAME' is not in your PATH. To fix:${NC}"
        echo "   export PATH=\"\$PATH:${INSTALL_DIR}\""
        echo "   (Add this to ~/.bashrc or ~/.zshrc to make it permanent)"
    else
        echo -e "${GREEN}✓ '$BIN_NAME' is available in PATH${NC}"
        echo -e "${YELLOW}💡 If it still shows an old version, run: hash -r${NC}"
    fi
}

main "$@"
