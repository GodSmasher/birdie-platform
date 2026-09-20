/** Workflows page (/demo/workflows). */
export const workflows: Record<string, string> = {
  // Top bar + KPI cards
  'Automation orchestration': 'Automatisierungssteuerung',
  workflows: 'Workflows',
  ACTIVE: 'AKTIV',
  'workflows running': 'Workflows laufen',
  'IN PROGRESS': 'IN BEARBEITUNG',
  'active runs': 'aktive Läufe',
  COMPLETED: 'ABGESCHLOSSEN',
  'total runs': 'Läufe gesamt',
  'TOTAL STEPS': 'SCHRITTE GESAMT',
  'automated actions': 'automatisierte Aktionen',

  // List + detail panel
  DRAFT: 'ENTWURF',
  PAUSED: 'PAUSIERT',
  Trigger: 'Auslöser',
  steps: 'Schritte',
  Avg: 'Ø',
  active: 'aktiv',
  Close: 'Schließen',
  'Active Runs': 'Aktive Läufe',
  'Total Runs': 'Läufe gesamt',
  'Avg Duration': 'Ø Dauer',
  'Workflow Steps': 'Workflow-Schritte',
  BOT: 'BOT',
  HUMAN: 'MENSCH',
  CONDITION: 'BEDINGUNG',
  WAIT: 'WARTEN',
  Bot: 'Bot',
  Human: 'Mensch',
  Condition: 'Bedingung',
  Wait: 'Warten',

  // Durations
  '18 days': '18 Tage',
  '2 hours': '2 Stunden',
  '18 hours': '18 Stunden',
  '5 days': '5 Tage',

  // WF-01
  'NES Interconnection — Full Cycle': 'NES-Netzanmeldung – Gesamtablauf',
  'End-to-end automation from application to Permission to Operate':
    'Durchgängige Automatisierung vom Antrag bis zur Betriebserlaubnis (PTO)',
  'Project moved to "Open" stage': 'Projekt in Phase „Offen“ verschoben',
  'Fill NES DG Application PDF': 'NES-Anmeldeformular (PDF) ausfüllen',
  'AI Document Filler pulls project data into NES form':
    'AI Document Filler überträgt Projektdaten in das NES-Formular',
  'Attach single-line diagram': 'Übersichtsschaltplan anhängen',
  'Aurora Solar Sync fetches latest design': 'Aurora Solar Sync ruft die aktuelle Planung ab',
  'Review & approve application': 'Antrag prüfen & freigeben',
  'Installer reviews filled form before submission':
    'Installateur prüft das ausgefüllte Formular vor dem Einreichen',
  'Email to NES': 'E-Mail an NES',
  'NES Bot sends to interconnection@utility.example':
    'NES Bot sendet an interconnection@utility.example',
  'Wait for NES response': 'Auf Antwort von NES warten',
  'Monitor inbox — 15-day follow-up if no response':
    'Postfach überwachen – Nachfassen nach 15 Tagen ohne Antwort',
  'NES approved?': 'Von NES genehmigt?',
  'Branch: approved → continue, rejected → notify + manual review':
    'Verzweigung: genehmigt → weiter, abgelehnt → Benachrichtigung + manuelle Prüfung',
  'File Metro Nashville permit': 'Baugenehmigung bei Metro Nashville beantragen',
  'AI Document Filler prepares building permit application':
    'AI Document Filler bereitet den Bauantrag vor',
  'Schedule NES inspection': 'NES-Abnahme terminieren',
  'Coordinator books inspection date with NES': 'Koordinator vereinbart den Abnahmetermin mit NES',
  'Run NEC 690 + IEEE 1547 check': 'Prüfung nach NEC 690 + IEEE 1547 durchführen',
  'Compliance bots validate system before inspection':
    'Compliance-Bots prüfen die Anlage vor der Abnahme',
  'Enroll in TVA DPP': 'Im TVA DPP anmelden',
  'Register on green.mytva.com, upload interconnection agreement':
    'Auf green.mytva.com registrieren, Netzanschlussvertrag hochladen',
  'Generate IRA §48 docs': 'Unterlagen nach IRA §48 erstellen',
  'IRA Tracker creates tax credit documentation':
    'IRA Tracker erstellt die Dokumentation für die Steuergutschrift',
  'Mark PTO complete': 'PTO als abgeschlossen markieren',
  'Update project status, notify customer': 'Projektstatus aktualisieren, Kunden benachrichtigen',

  // WF-02
  'New Lead Qualification': 'Qualifizierung neuer Leads',
  'Automatically qualify and route new leads from all sources':
    'Neue Leads aus allen Quellen automatisch qualifizieren und zuweisen',
  'New lead created (SalesRabbit, Google Ads, Referral, D2D)':
    'Neuer Lead angelegt (SalesRabbit, Google Ads, Empfehlung, Haustürvertrieb)',
  'Enrich lead data': 'Lead-Daten anreichern',
  'Pull address, roof data, utility territory from public records':
    'Adresse, Dachdaten und Netzgebiet aus öffentlichen Registern abrufen',
  'Check NES service territory': 'NES-Netzgebiet prüfen',
  'Verify address is in NES/TVA territory': 'Prüfen, ob die Adresse im NES/TVA-Netzgebiet liegt',
  'Estimate system size': 'Anlagengröße schätzen',
  'Aurora Solar quick estimate based on roof area + orientation':
    'Schnellschätzung mit Aurora Solar anhand von Dachfläche + Ausrichtung',
  'Score lead': 'Lead bewerten',
  'Calculate lead score: roof age, shade, electricity bill, source quality':
    'Lead-Score berechnen: Dachalter, Verschattung, Stromrechnung, Qualität der Quelle',
  'Score > 70?': 'Score > 70?',
  'High-score → fast track, low-score → nurture sequence':
    'Hoher Score → Fast Track, niedriger Score → Nurturing-Strecke',
  'Assign to sales rep': 'Vertriebsmitarbeiter zuweisen',
  'Round-robin between Marcus Cole and Sarah Mitchell':
    'Abwechselnd an Marcus Cole und Sarah Mitchell',
  'Send intro email': 'Erste E-Mail senden',
  'Personalized email with estimated savings + IRA credit info':
    'Personalisierte E-Mail mit geschätzter Ersparnis + Infos zur IRA-Steuergutschrift',
  'Schedule follow-up': 'Nachfassen einplanen',
  'Create task for rep — call within 24 hours':
    'Aufgabe für den Vertrieb anlegen – Anruf innerhalb von 24 Stunden',

  // WF-03
  'Installation Day Checklist': 'Checkliste Montagetag',
  'Ensures all pre-install requirements are met and coordinates crew dispatch':
    'Stellt sicher, dass alle Voraussetzungen vor der Montage erfüllt sind, und koordiniert den Einsatz des Montageteams',
  '24 hours before scheduled install date': '24 Stunden vor dem geplanten Montagetermin',
  'Verify permit status': 'Genehmigungsstatus prüfen',
  'Check Metro Nashville permit is approved and on-site':
    'Prüfen, ob die Genehmigung von Metro Nashville erteilt ist und vor Ort vorliegt',
  'Confirm equipment delivery': 'Materiallieferung bestätigen',
  'Verify panels, inverter, racking are at warehouse':
    'Prüfen, ob Module, Wechselrichter und Unterkonstruktion im Lager sind',
  'Run pre-install compliance': 'Compliance-Prüfung vor der Montage',
  'NEC 690 + IEEE 1547 final check on design':
    'Abschließende Prüfung der Planung nach NEC 690 + IEEE 1547',
  'All clear?': 'Alles in Ordnung?',
  'Missing items → alert coordinator, all good → proceed':
    'Fehlende Punkte → Koordinator benachrichtigen, alles in Ordnung → weiter',
  'Assign crew + vehicle': 'Montageteam + Fahrzeug zuweisen',
  'Dispatcher assigns crew and loads truck':
    'Disponent teilt das Montageteam ein und belädt das Fahrzeug',
  'Send customer confirmation': 'Bestätigung an Kunden senden',
  'SMS + email with crew arrival time and what to expect':
    'SMS + E-Mail mit Ankunftszeit des Montageteams und Infos zum Ablauf',
  'Generate install packet': 'Montagemappe erstellen',
  'Print permit, design, safety docs, customer sign-off sheet':
    'Genehmigung, Planung, Sicherheitsunterlagen und Abnahmeprotokoll für den Kunden drucken',
  'Post-install photo upload': 'Foto-Upload nach der Montage',
  'Crew uploads photos for NES inspection file':
    'Montageteam lädt Fotos für die NES-Abnahmeakte hoch',

  // WF-04
  'Post-Install NES Inspection': 'NES-Abnahme nach der Montage',
  'Coordinates NES inspection scheduling and follow-up after installation':
    'Koordiniert Terminierung und Nachverfolgung der NES-Abnahme nach der Montage',
  'Installation marked complete': 'Montage als abgeschlossen markiert',
  'Generate inspection package': 'Abnahmeunterlagen erstellen',
  'Compile as-built, photos, test results, compliance certs':
    'Bestandsdokumentation, Fotos, Messprotokolle und Konformitätsnachweise zusammenstellen',
  'Request NES inspection': 'NES-Abnahme anfragen',
  'Email NES with inspection request + package':
    'E-Mail an NES mit Abnahmeanfrage + Unterlagen',
  'Wait for inspection date': 'Auf Abnahmetermin warten',
  'Monitor for NES response — follow up after 5 business days':
    'Antwort von NES überwachen – Nachfassen nach 5 Werktagen',
  'Prep customer for inspection': 'Kunden auf die Abnahme vorbereiten',
  'Send customer what to expect, ensure panel access':
    'Kunden über den Ablauf informieren, Zugang zur Anlage sicherstellen',
  'Inspection passed?': 'Abnahme bestanden?',
  'Pass → PTO, fail → generate correction list':
    'Bestanden → PTO, nicht bestanden → Mängelliste erstellen',
  'Submit PTO request': 'PTO-Antrag einreichen',
  'Request Permission to Operate from NES': 'Betriebserlaubnis (PTO) bei NES beantragen',

  // WF-05
  'Monthly Performance Report': 'Monatlicher Ertragsbericht',
  'Generate and send production reports for all installed systems':
    'Ertragsberichte für alle installierten Anlagen erstellen und versenden',
  '1st of each month': 'Am 1. jedes Monats',
  'Pull Enphase production data': 'Enphase-Ertragsdaten abrufen',
  'Aggregate daily kWh from Enlighten API': 'Tägliche kWh aus der Enlighten-API aggregieren',
  'Compare vs Aurora estimate': 'Mit Aurora-Prognose vergleichen',
  'Calculate actual/expected ratio per system': 'Ist/Soll-Verhältnis je Anlage berechnen',
  'Underperformance > 15%?': 'Minderertrag > 15 %?',
  'Flag systems needing maintenance review': 'Anlagen mit Wartungsbedarf kennzeichnen',
  'Generate customer report PDF': 'Kundenbericht als PDF erstellen',
  'Branded report with charts, savings, carbon offset':
    'Bericht im Firmendesign mit Diagrammen, Ersparnis und CO₂-Einsparung',
  'Email report to customer': 'Bericht per E-Mail an Kunden senden',
  'Personalized email with PDF attachment': 'Personalisierte E-Mail mit PDF-Anhang',
};
