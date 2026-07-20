#!/usr/bin/env bash
#
# NextDeploy CLI installer
#   curl -fsSL https://nextdeploy.org/install.sh | bash
#
# Downloads the latest release binary for your OS/arch from GitHub and installs
# it to ~/.local/bin/nextdeploy. No Node, no npm — it's a single Go binary.
#
set -euo pipefail

REPO="aynaash/NextDeploy"
BIN="nextdeploy"
INSTALL_DIR="${NEXTDEPLOY_INSTALL_DIR:-$HOME/.local/bin}"

err()  { printf '\033[31merror:\033[0m %s\n' "$1" >&2; exit 1; }
info() { printf '\033[36m==>\033[0m %s\n' "$1"; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$1"; }

# --- detect platform -------------------------------------------------------
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
case "$OS" in
  linux)  OS="linux"  ;;
  darwin) OS="darwin" ;;
  *) err "unsupported OS '$OS'. On Windows use install.bat or WSL2." ;;
esac

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)  ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) err "unsupported architecture '$ARCH'." ;;
esac

for dep in curl tar; do
  command -v "$dep" >/dev/null 2>&1 || err "'$dep' is required but not installed."
done

# --- resolve latest release tag (via the /latest redirect, no API token) ---
info "Resolving latest release…"
TAG="$(curl -fsSLI -o /dev/null -w '%{url_effective}' \
  "https://github.com/$REPO/releases/latest" | sed 's#.*/tag/##')"
[ -n "$TAG" ] || err "could not determine the latest release tag."
VERSION="${TAG#v}"
info "Latest is $TAG ($OS/$ARCH)"

ASSET="${BIN}_${VERSION}_${OS}_${ARCH}.tar.gz"
URL="https://github.com/$REPO/releases/download/$TAG/$ASSET"

# --- download + extract ----------------------------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

info "Downloading $ASSET…"
curl -fsSL "$URL" -o "$TMP/$ASSET" || err "download failed: $URL"

# Verify checksum when checksums.txt is published and a sha256 tool exists.
if curl -fsSL "https://github.com/$REPO/releases/download/$TAG/checksums.txt" \
     -o "$TMP/checksums.txt" 2>/dev/null; then
  if command -v sha256sum >/dev/null 2>&1; then SHA="sha256sum"
  elif command -v shasum >/dev/null 2>&1; then SHA="shasum -a 256"
  else SHA=""; fi
  if [ -n "$SHA" ]; then
    EXPECTED="$(grep " $ASSET\$" "$TMP/checksums.txt" | awk '{print $1}')"
    ACTUAL="$(cd "$TMP" && $SHA "$ASSET" | awk '{print $1}')"
    [ -z "$EXPECTED" ] || [ "$EXPECTED" = "$ACTUAL" ] || err "checksum mismatch for $ASSET."
    [ -z "$EXPECTED" ] || ok "Checksum verified"
  fi
fi

info "Extracting…"
tar -xzf "$TMP/$ASSET" -C "$TMP" "$BIN"

# --- install ---------------------------------------------------------------
mkdir -p "$INSTALL_DIR"
install -m 0755 "$TMP/$BIN" "$INSTALL_DIR/$BIN"
ok "Installed $BIN $TAG to $INSTALL_DIR/$BIN"

# --- PATH guidance ---------------------------------------------------------
case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *)
    printf '\n\033[33mnote:\033[0m %s is not on your PATH. Add it with:\n\n' "$INSTALL_DIR"
    printf '  echo '\''export PATH="%s:$PATH"'\'' >> ~/.bashrc && source ~/.bashrc\n\n' "$INSTALL_DIR"
    ;;
esac

info "Run 'nextdeploy --help' to get started."
