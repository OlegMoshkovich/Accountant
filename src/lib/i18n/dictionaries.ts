// Bilingual dictionary (German / English) for the client portal.
// German is the default; users switch via the LocaleSwitcher, which stores the
// choice in a `locale` cookie read by getDict() on the server.

export const dictionaries = {
  de: {
    nav: {
      myDocuments: "Meine Dokumente",
      administration: "Verwaltung",
      toPortal: "Zum Portal",
      clientPortal: "Mandantenportal",
    },
    home: {
      heroTitle:
        "Alteingesessene und renommierte Sozietät für Wirtschaftsprüfung und Steuerberatung.",
      heroBody:
        "Als Wirtschaftsprüfungs- & Steuerberatungsgesellschaft bieten wir seit vielen Jahren unseren Mandanten – Privatpersonen, Freiberufler, Industrie-, Handels- und Dienstleistungsunternehmen – qualifizierte Beratung in allen steuerlichen, rechtlichen und betriebswirtschaftlichen Fragen.",
      requestAccess: "Zugang beantragen",
      signIn: "Anmelden",
      servicesTitle: "Unsere Leistungen",
      imageAlt: "Konferenzraum der Kanzlei",
      footerType:
        "Wirtschaftsprüfungsgesellschaft · Steuerberatungsgesellschaft",
      rightsReserved: "Alle Rechte vorbehalten.",
      services: [
        {
          title: "Steuerberatung",
          body: "Laufende Steuerberatung, Steuererklärungen und Vertretung gegenüber dem Finanzamt für Privatpersonen und Unternehmen.",
        },
        {
          title: "Wirtschaftsprüfung",
          body: "Prüfung von Jahres- und Konzernabschlüssen sowie betriebswirtschaftliche Beratung mit langjähriger Erfahrung.",
        },
        {
          title: "Jahresabschlüsse",
          body: "Erstellung von Jahresabschlüssen, Buchhaltung und Lohnabrechnung – zuverlässig und termingerecht.",
        },
      ],
    },
    pending: {
      reviewTitle: "Zugang wird geprüft",
      rejectedTitle: "Zugang nicht freigegeben",
      reviewBody:
        "Vielen Dank für Ihre Registrierung bei {firm}. Ihr Zugang wird derzeit von unserer Kanzlei geprüft und in Kürze freigeschaltet.",
      rejectedBody:
        "Ihr Zugang wurde nicht freigegeben. Bitte kontaktieren Sie unsere Kanzlei für weitere Informationen.",
      signedInAs: "Angemeldet als",
      signOut: "Abmelden",
    },
    signUp: {
      intro:
        "Nach der Registrierung prüft unsere Kanzlei Ihren Zugang und schaltet ihn frei. Sie erhalten anschließend Zugriff auf Ihre Dokumente.",
    },
    portal: {
      title: "Meine Dokumente",
      welcome:
        "Willkommen{name}. Hier finden Sie alle von uns für Sie erstellten Unterlagen.",
      emptyTitle: "Es liegen noch keine Dokumente für Sie bereit.",
      emptyBody:
        "Sobald unsere Kanzlei Unterlagen für Sie hochlädt, erscheinen sie hier.",
      colDocument: "Dokument",
      colCategory: "Kategorie",
      colYear: "Jahr",
      colDate: "Datum",
      colAction: "Aktion",
      download: "Herunterladen",
    },
    admin: {
      title: "Verwaltung",
      subtitle:
        "Neue Zugänge freigeben und Dokumente für Mandanten bereitstellen.",
      pendingApprovals: "Offene Freigaben",
      noPending: "Keine offenen Freigaben.",
      colName: "Name",
      colEmail: "E-Mail",
      colRegistered: "Registriert",
      colAction: "Aktion",
      approve: "Freigeben",
      reject: "Ablehnen",
      clients: "Mandanten",
      noClients: "Noch keine freigegebenen Mandanten.",
      docsShort: "Dok.",
      colDocuments: "Dokumente",
      manageDocuments: "Dokumente verwalten →",
      youMarker: "(Sie)",
    },
    clientDetail: {
      back: "← Zurück zur Verwaltung",
      provideNew: "Neues Dokument bereitstellen",
      provided: "Bereitgestellte Dokumente ({n})",
      noneUploaded:
        "Für diesen Mandanten wurden noch keine Dokumente hochgeladen.",
      view: "Ansehen",
    },
    upload: {
      title: "Titel",
      titlePlaceholder: "z. B. Einkommensteuererklärung 2024",
      category: "Kategorie",
      year: "Jahr",
      file: "Datei",
      uploading: "Wird hochgeladen…",
      submit: "Dokument hochladen",
      failed: "Upload fehlgeschlagen.",
    },
    doc: {
      confirmDelete: "Dieses Dokument wirklich löschen?",
      delete: "Löschen",
    },
    categories: {
      "Tax Return": "Steuererklärung",
      "Annual Report": "Jahresbericht",
      "VAT Filing": "Umsatzsteuervoranmeldung",
      Payroll: "Lohnabrechnung",
      Invoice: "Rechnung",
      Correspondence: "Korrespondenz",
      Other: "Sonstiges",
    } as Record<string, string>,
  },

  en: {
    nav: {
      myDocuments: "My documents",
      administration: "Administration",
      toPortal: "Go to portal",
      clientPortal: "Client portal",
    },
    home: {
      heroTitle:
        "A long-established and renowned firm for audit and tax advisory.",
      heroBody:
        "As an audit and tax advisory firm, for many years we have provided our clients – private individuals, freelancers, industrial, commercial and service companies – with qualified advice on all tax, legal and business-management matters.",
      requestAccess: "Request access",
      signIn: "Sign in",
      servicesTitle: "Our services",
      imageAlt: "The firm's conference room",
      footerType: "Audit firm · Tax advisory firm",
      rightsReserved: "All rights reserved.",
      services: [
        {
          title: "Tax advisory",
          body: "Ongoing tax advice, tax returns and representation before the tax authorities for individuals and businesses.",
        },
        {
          title: "Audit",
          body: "Auditing of annual and consolidated financial statements as well as business consulting with many years of experience.",
        },
        {
          title: "Annual accounts",
          body: "Preparation of annual financial statements, bookkeeping and payroll – reliable and on time.",
        },
      ],
    },
    pending: {
      reviewTitle: "Access under review",
      rejectedTitle: "Access not granted",
      reviewBody:
        "Thank you for registering with {firm}. Your access is currently being reviewed by our firm and will be activated shortly.",
      rejectedBody:
        "Your access has not been granted. Please contact our firm for more information.",
      signedInAs: "Signed in as",
      signOut: "Sign out",
    },
    signUp: {
      intro:
        "After registering, our firm will review and activate your access. You'll then be able to access your documents.",
    },
    portal: {
      title: "My documents",
      welcome:
        "Welcome{name}. Here you'll find all the documents we have prepared for you.",
      emptyTitle: "No documents are available for you yet.",
      emptyBody:
        "As soon as our firm uploads documents for you, they'll appear here.",
      colDocument: "Document",
      colCategory: "Category",
      colYear: "Year",
      colDate: "Date",
      colAction: "Action",
      download: "Download",
    },
    admin: {
      title: "Administration",
      subtitle: "Approve new access requests and provide documents for clients.",
      pendingApprovals: "Pending approvals",
      noPending: "No pending approvals.",
      colName: "Name",
      colEmail: "Email",
      colRegistered: "Registered",
      colAction: "Action",
      approve: "Approve",
      reject: "Reject",
      clients: "Clients",
      noClients: "No approved clients yet.",
      docsShort: "docs",
      colDocuments: "Documents",
      manageDocuments: "Manage documents →",
      youMarker: "(you)",
    },
    clientDetail: {
      back: "← Back to administration",
      provideNew: "Provide a new document",
      provided: "Provided documents ({n})",
      noneUploaded: "No documents have been uploaded for this client yet.",
      view: "View",
    },
    upload: {
      title: "Title",
      titlePlaceholder: "e.g. Income tax return 2024",
      category: "Category",
      year: "Year",
      file: "File",
      uploading: "Uploading…",
      submit: "Upload document",
      failed: "Upload failed.",
    },
    doc: {
      confirmDelete: "Really delete this document?",
      delete: "Delete",
    },
    categories: {
      "Tax Return": "Tax Return",
      "Annual Report": "Annual Report",
      "VAT Filing": "VAT Filing",
      Payroll: "Payroll",
      Invoice: "Invoice",
      Correspondence: "Correspondence",
      Other: "Other",
    } as Record<string, string>,
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export const LOCALES = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "de";

export function isLocale(value: string | undefined): value is Locale {
  return value === "de" || value === "en";
}
