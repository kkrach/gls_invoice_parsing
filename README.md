# gls\_invoice\_parsing

Firefox extension to add a textbox to the GLS online banking, to extract IBAN, BIC, etc. from invoice text.

Extension created according to this example:
	https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension

## Deploying

In 'about:debugging' you can click on 'This Firefox' and then on 'Load Temporary Add-on'. There
select any file from this folder to load the add-on until the next start of the browser.

You can also create an XPI file with the script 'create\_xpi.sh' and install the extension as
regularly via 'Add-ons' (CTRL+Shift+A).

Otherwise, go to https://addons.mozilla.org/en-US/developers/ (create a mozilla account if needed)
and upload the XPI file (created by create\_xpi.sh).
