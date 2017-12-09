#!/bin/bash
# NOTE: This file runs a sub-script (and therefore, a shell).
#       You must run this script as ". <script>" or "source <script>".

CURDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PIP_FILE=${CURDIR}/pip_requirements.txt

# all pip packages
if [ -f ${PIP_FILE} ]; then
    echo "Upgrading pip ..."
    pip install --upgrade pip
    echo "Installing pip packages..."
    pip install -r ${PIP_FILE}
fi
