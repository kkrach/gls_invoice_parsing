#!/bin/sh -ue
#
# Creates the XPI file for this plugin
#

zip -FS gls_invoice_parsing.xpi manifest.json icons/invoice-parsing-48.png invoice_parsing.js

echo
echo "Create gls_invoice_parsing.xpi"
echo
