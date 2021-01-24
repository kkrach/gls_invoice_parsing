/**
 * Script to add a textbox to the GLS online banking, to extract IBAN, BIC, etc. from invoice text.
 *
 * Author: Karl Krach <github@kkrach.de>
 * Date:   2018/01/14
 * Tested: Firefox 57.0.4 (64 bit)
 */

console.log("Loaded script of 'gls_invoice_parsing.");

var recv_form = document.getElementById("empfaenger");
if (recv_form) {
	parse_recv_from(recv_form);
}
else {
	console.log("Cannot find matching input box! Trying again in one second...");
	setTimeout(function() {
		var recv_form = document.getElementById("empfaenger");
		if (recv_form) {
			console.log("Found input box after timeout!");
			parse_recv_from(recv_form);
		}
		else {
			console.log("Cannot find matching input box!");
		}
	}, 2000);
}
		var right_input = document.createElement("textarea");
		right_input.id = "KKR_invoice_input";
		right_input.rows = "6";
		right_input.className = "gad-control gad-input";




function parse_recv_from(recv_form) {
	var parent_content = recv_form.parentNode;
	while (parent_content && !parent_content.classList.contains("v-csslayout-forms-field-group")) {
		parent_content = parent_content.parentNode;
	}
	if (parent_content) {
		var container = document.createElement("div");
		container.className = "KKK v-csslayout v-layout v-widget forms-field-group v-csslayout-forms-field-group";

		// Left column: label
		var left_column = document.createElement("div");
		left_column.className = "KKK v-csslayout v-layout v-widget block v-csslayout-block";
		container.appendChild(left_column);

		var caption = document.createElement("div");
		caption.className = "KKK v-caption v-caption-label";
		left_column.appendChild(caption);

		var caption_text = document.createElement("div");
		caption_text.className = "KKK v-captiontext";
		caption.appendChild(caption_text);

		var text_node = document.createTextNode("Rechnungstext:");
		caption_text.appendChild(text_node);

		// Right column: text area
		var right_column = document.createElement("div");
		right_column.className = "KKK v-csslayout v-layout v-widget block v-csslayout-block";
		container.appendChild(right_column);

		var right_deco1 = document.createElement("span");
		right_deco1.className = "twitter-typeahead";
		//style="position: relative; direction: ltr;"
		right_column.appendChild(right_deco1);

		var right_input = document.createElement("textarea");
		right_input.id = "KKR_invoice_input";
		right_input.rows = "6";
		right_input.className = "v-widget v-textarea";
		right_deco1.appendChild(right_input);

		var right_button = document.createElement("button");
		right_button.type = "button";
		right_button.className = "v-nativebutton v-button";
		right_button.onclick = parse_invoice_text;
		right_deco1.appendChild(right_button);

		var right_span = document.createElement("span");
		right_span.className = "v-nativebutton-caption";
		right_button.appendChild(right_span);

		var button_text = document.createTextNode("Rechnungstext auswerten");
		right_span.appendChild(button_text);

		var node = parent_content.parentNode.insertBefore(container, parent_content);
		if (!node) console.log("Something went wrong during insertion...");
	}
	else {
		console.log("Cannot determine right parent node!");
	}
}

function write_value(name, id, value) {
	var input = document.getElementById(id);
	if (!input) {
		console.log("Error: Cannot find " + name + " input!");
	}
	else {
		var trimmed = value.trim();
		input.value = trimmed;
		console.log("Written '" + trimmed + "' to " + name + " field.");
	}
}

function write_child_input(name, id, value) {
	var par = document.getElementById(id);
	if (!par) {
		console.log("Error: Cannot find parent for " + name + " input!");
	}
	else {
		var inputs = par.getElementsByTagName("INPUT");
		if (inputs.length !== 1) {
			console.log("Error: Found " + inputs.length + " inputs of " + name);
		}
		else {
			var trimmed = value.trim();
			inputs[0].value = trimmed;
			console.log("Written '" + trimmed + "' to child input of " + name + ".");
		}
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
			if ((result = line.match(/IBAN *:? *(D?E?[0-9 ]*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("IBAN", "empfaengerIBAN", result[1]);
			}
			else if ((result = line.match(/.*BIC *:? *([A-Z0-9]*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				//write_value("BIC", "ID_INPUT_BIC", result[1].replace(/\(.*\)/,""));
			}
			else if ((result = line.match(/Verwendungszweck *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Verwendungszweck", "verwendungszweck", result[1]);
			}
			else if ((result = line.match(/Betreff *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Verwendungszweck", "verwendungszweck", result[1]);
			}
			else if ((result = line.match(/Empfänger *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Empfänger", "empfaenger", result[1]);
			}
			else if ((result = line.match(/Inhaber *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_value("Empfänger", "empfaenger", result[1]);
			}
			else if ((result = line.match(/Summe *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_child_input("Betrag", "betrag", result[1].replace(/EUR|€/,""));
			}
			else if ((result = line.match(/Betrag *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_child_input("Betrag", "betrag", result[1].replace(/EUR|€/,""));
			}
			else if ((result = line.match(/Total *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_child_input("Betrag", "betrag", result[1].replace(/EUR|€/,""));
			}
			else if ((result = line.match(/Gesamt *:?(.*)/i)) != null) {
				// use next line, if result[1] is empty
				if (result[1].trim().length == 0) result[1] = invoice_lines[++cnt];
				write_child_input("Betrag", "betrag", result[1].replace(/EUR|€/,""));
			}
			else {
				console.log("Unparseable: " + line);
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
