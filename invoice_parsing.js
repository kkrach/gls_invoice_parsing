/**
 * Script to add a textbox to the GLS online banking, to extract IBAN, BIC, etc. from invoice text.
 *
 * Author: Karl Krach <github@kkrach.de>
 * Date:   2018/01/14
 * Tested: Firefox 57.0.4 (64 bit)
 */

var recv_form = document.getElementById("ID_INPUT_EMPFAENGERNAME");
if (recv_form) {
	var regex = /BOX_.*_content/;
	var parent_content = recv_form.parentNode;
	while (parent_content && !(parent_content.id && parent_content.id.match(regex))) {
		parent_content = parent_content.parentNode;
	}
	if (parent_content) {
		var container = document.createElement("div");
		container.className = "gad-block ym-grid ym-clearfix";

		var left_column = document.createElement("div");
		left_column.className = "gad-blockHeader ym-g30 ym-gl";
		container.appendChild(left_column);
		var left_label = document.createElement("label");
		left_label.for = "invoice_input";
		left_label.className = "gad-label";
		left_column.appendChild(left_label);
		var label_text = document.createTextNode("Rechnungstext:");
		left_label.appendChild(label_text);

		var right_column = document.createElement("div");
		right_column.className = "gad-blockContent ym-g70 ym-gr";
		container.appendChild(right_column);
		// Create input field
		var right_deco1 = document.createElement("div");
		right_deco1.className = "gad-decoratedControl ym-g70";
		right_column.appendChild(right_deco1);
		var right_input = document.createElement("textarea");
		right_input.id = "KKR_invoice_input";
		right_input.rows = "6";
		right_input.className = "gad-control gad-input";
		right_deco1.appendChild(right_input);
		// Create "Parse" button
		var right_deco2 = document.createElement("div");
		right_deco2.className = "gad-decoratedControl ym-g70";
		right_column.appendChild(right_deco2);
		var right_button = document.createElement("button");
		right_button.type = "button";
		right_button.className = "gad-button";
		right_button.onclick = parse_invoice_text;
		right_deco2.appendChild(right_button);
		var button_text = document.createTextNode("Rechnungstext auswerten");
		right_button.appendChild(button_text);

		parent_content.insertBefore(container, parent_content.firstChild);
	}
}
function write_value(name, id, value) {
	var trimmed = value.trim();
	var input = document.getElementById(id);
	if (!input) {
		console.log("Error: Cannot find " + name + " input!");
	}
	else {
		input.value = trimmed;
		console.log("Written '" + trimmed + "' to " + name + " field.");
	}
}
function parse_invoice_text() {
	var invoice_text_box = document.getElementById("KKR_invoice_input");
	if (!invoice_text_box) {
		console.log("Error: Cannot find invoice input!");
		return;
	}
	var unparseable = "";
	var invoice_text = invoice_text_box.value;
	var invoice_lines = invoice_text.split("\n");
	for (var cnt=0; cnt < invoice_lines.length; cnt++) {
		var line = invoice_lines[cnt];
		if (line.trim().length > 0) {
			if ((result = line.match(/IBAN:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("IBAN", "ID_INPUT_IBAN", result[1]);
			}
			else if ((result = line.match(/.*BIC.*:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("BIC", "ID_INPUT_BIC", result[1].replace(/\(.*\)/,""));
			}
			else if ((result = line.match(/Verwendungszweck:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Verwendungszweck", "ID_INPUT_VERWENDUNGSZWECK1", result[1]);
			}
			else if ((result = line.match(/Betreff:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Verwendungszweck", "ID_INPUT_VERWENDUNGSZWECK1", result[1]);
			}
			else if ((result = line.match(/Empfänger:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Empfänger", "ID_INPUT_EMPFAENGERNAME", result[1]);
			}
			else if ((result = line.match(/Inhaber:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Empfänger", "ID_INPUT_EMPFAENGERNAME", result[1]);
			}
			else if ((result = line.match(/Betrag:(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Empfänger", "ID_INPUT_BETRAG", result[1].replace(/EUR/,""));
			}
			else {
//				console.log("Unparseable: " + line);
				unparseable += line + "\n";
			}
		}
	}
	invoice_text_box.value = unparseable;
}









/*

Überweisung an CHECK24
Zahlungsempfänger:
CHECK24
IBAN:
DE45700400410277971803
BIC:
COBADEFFXXX (Commerzbank)
Betrag:
12,22 EUR
Verwendungszweck:
2017-22883773-1 Norbert Bluem


Unsere Bankverbindung::
IBAN: DE86400400280426647402
BIC: COBADEFFXXX
AMBIENDO GmbH & Co. KG
Verwendungszweck: 29083773893
Betrag: 87,21 EUR




Bankverbindung:
IBAN: DE63258501100045105970
SWIFT/BIC: NOLADE21UEL
Kontonummer 45105970 von Hobbydirekt Modellbau
BLZ: 25850110 bei der KSK Uelzen
Bei Zahlung per Bitcoin unsere Empfängeradresse: 3FLbjYnqZzKJ5SE4qiPNSFmRfaLKe5mxsX
Betreff: Ihre Auftragsnummer
Kontoinhaber:
Hobbydirekt Modellbau e.K.
Marco Lohse
Am Deich 13
D-29475 Meetschow






Überweisung per Vorkasse

Schaaf & Klemm GbR - Weine der Pfalz
Kto: 254459702
BLZ: 60010070
Betreff: Ihre Bestellnummer
Postbank Stuttgart

Internationale Zahlungen:
IBAN: DE19600100700254459702
BIC / SWIFT: PBNKDEFF





 Bankverbindung:
Bankinstitut: Aachener Bank
Bankleitzahl: 39060180
Kontonummer: 149077014
Inhaber: Günther Bogenrieder
IBAN: DE06 3906 0180 0149 0770 14
BIC: GENODED1AAC
R Ü C K F R A G E N:
Sollten Sie noch weitere Fragen zu dieser Bestellung haben, dann geben Sie bitte in jeder Email die Bestellnr. 271391 an.




Bankverbindung:
 		
		Vorkassen-Konto:
 		 Commerzbank Karlsruhe
  		 BLZ 66080052
  		 Kto 612915800
  		 Swift: DRESDEFF660
  		 IBAN: DE23 6608 0052 0612 9158 00
 
		Rechnungs-Konto:
  		 Volksbank Karlsruhe
  		 BLZ 66190000
  		 Kto 40006338
  		 Swift: GENODE61KA1
  		 IBAN: DE25 6619 0000 0040 0063 38

USt.-ID:	DE261441153







Empfänger:

MMKS GmbH
BIC/SWIFT: COBADEFF700
IBAN: DE79700400410662769900
BLZ: 700 400 41
Konto Nr.: 6627699
Commerzbank




*/
