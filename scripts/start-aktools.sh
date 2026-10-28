#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="${AKTOOLS_VENV_DIR:-${ROOT_DIR}/.aktools-venv}"
HOST="${AKTOOLS_HOST:-127.0.0.1}"
PORT="${AKTOOLS_PORT:-8080}"
WORKERS="${AKTOOLS_WORKERS:-2}"
AKTOOLS_VERSION="$(sed -n 's/^aktools==//p' "${ROOT_DIR}/requirements-aktools.txt")"
AKSHARE_VERSION="$(sed -n 's/^akshare==//p' "${ROOT_DIR}/requirements-aktools.txt")"
CURL_CFFI_VERSION="$(sed -n 's/^curl-cffi==//p' "${ROOT_DIR}/requirements-aktools.txt")"
CFFI_VERSION="$(sed -n 's/^cffi==//p' "${ROOT_DIR}/requirements-aktools.txt")"

if [[ ! -x "${VENV_DIR}/bin/python" ]]; then
  echo "Creating AkTools virtual environment at ${VENV_DIR}"
  # AkShare may not publish a wheel for the newest local Python yet.
  # Reuse compatible system packages when they are already installed.
  python3 -m venv --system-site-packages "${VENV_DIR}"
fi

INSTALLED_AKTOOLS_VERSION="$("${VENV_DIR}/bin/python" -c 'import importlib.metadata; print(importlib.metadata.version("aktools"))' 2>/dev/null || true)"
INSTALLED_AKSHARE_VERSION="$("${VENV_DIR}/bin/python" -c 'import importlib.metadata; print(importlib.metadata.version("akshare"))' 2>/dev/null || true)"
INSTALLED_CURL_CFFI_VERSION="$("${VENV_DIR}/bin/python" -c 'import importlib.metadata; print(importlib.metadata.version("curl-cffi"))' 2>/dev/null || true)"
INSTALLED_CFFI_VERSION="$("${VENV_DIR}/bin/python" -c 'import importlib.metadata; print(importlib.metadata.version("cffi"))' 2>/dev/null || true)"
if [[ "${INSTALLED_AKTOOLS_VERSION}" != "${AKTOOLS_VERSION}" || "${INSTALLED_AKSHARE_VERSION}" != "${AKSHARE_VERSION}" || "${INSTALLED_CURL_CFFI_VERSION}" != "${CURL_CFFI_VERSION}" || "${INSTALLED_CFFI_VERSION}" != "${CFFI_VERSION}" ]]; then
  echo "Installing AkTools ${AKTOOLS_VERSION}, AkShare ${AKSHARE_VERSION}, curl-cffi ${CURL_CFFI_VERSION}, and cffi ${CFFI_VERSION}"
  # Install pinned packages without resolving the rest of the dependency tree;
  # this keeps the local Python 3.14 environment reproducible.
  "${VENV_DIR}/bin/python" -m pip install --no-deps -r "${ROOT_DIR}/requirements-aktools.txt"
fi

echo "Starting AkTools at http://${HOST}:${PORT}"
if [[ "${WORKERS}" -gt 1 ]]; then
  AKTOOLS_PACKAGE_DIR="$("${VENV_DIR}/bin/python" -c 'import pathlib, aktools; print(pathlib.Path(aktools.__file__).parent)')"
  exec "${VENV_DIR}/bin/python" -m uvicorn main:app \
    --app-dir "${AKTOOLS_PACKAGE_DIR}" \
    --host "${HOST}" \
    --port "${PORT}" \
    --workers "${WORKERS}"
fi

exec "${VENV_DIR}/bin/python" -m aktools --host "${HOST}" --port "${PORT}"
