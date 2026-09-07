// The ITSC printer directory.
//
// Transcribed from `ref/LU printers (main campus).xlsx` — the `Printers` sheet
// for the rows below, and its cell comments for `queues` and `mobile`. Only the
// rows whose Department is ITSC are here: the Library's ten machines and the
// Learning Commons copier in LYH208 belong to other offices, and a helper never
// checks or reports on them. Room codes are kept exactly as the sheet (and the
// signage) write them, in every locale; only the labels around them are
// translated, in `locales/*.ts` under the `printers.*` keys.
//
// `PrinterDirectory.vue` is the only reader. When the workbook changes, diff it
// against this file rather than editing from memory.

/** A capability the sheet records per printer. */
export type Support =
  /** Confirmed working. */
  | 'yes'
  /** Confirmed not available. */
  | 'no'
  /** Believed to work — nobody has tried it. The sheet writes this as "?". */
  | 'untested'
  /** The sheet leaves the cell blank. */
  | 'unknown'

/**
 * Every capability column, in the three groups the detail panel renders:
 * what comes out, what can send a job, and what you can do standing at it.
 */
export const FEATURE_GROUPS = {
  output: ['colour', 'bw', 'a4', 'a3', 'duplex'],
  printFrom: [
    'campusWindows',
    'campusMac',
    'personalWindows',
    'personalMac',
    'personalLinux',
    'webPdf',
    'android',
    'ios'
  ],
  atTheMachine: ['scanToEmail', 'copy', 'nfcOctopus', 'charged', 'selfPaper']
} as const

export type FeatureGroup = keyof typeof FEATURE_GROUPS
export type Feature = (typeof FEATURE_GROUPS)[FeatureGroup][number]

/** A print queue that has actually been made to work from a personal computer. */
export interface Queue {
  /** The address to add, protocol included. */
  uri: string
  /** The driver picked in the add-printer dialog, if one was recorded. */
  driver: string | null
}

export interface Printer {
  /** Slug, and the anchor other pages deep-link to (`/facilities/printers#sekg02-colour-copier`). */
  id: string
  /** Room code, as the rota and the door sign write it. */
  location: string
  /** Distinguishes machines sharing a room; null when the room has only one. */
  name: string | null
  ip: string
  host: string
  brand: string
  model: string
  features: Record<Feature, Support>
  queues: Queue[]
  /** How a phone reaches this machine, when one can. */
  mobile: 'web' | 'ricohApp' | null
}

export const PRINTERS: Printer[] = [
  {
    id: 'lby301',
    location: 'LBY301',
    name: null,
    ip: '10.2.124.11',
    host: 'prn-lab-lby301.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.11:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: null
  },
  {
    id: 'lby303',
    location: 'LBY303',
    name: null,
    ip: '10.2.124.12',
    host: 'prn-lab-lby303.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'yes',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.12:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: 'web'
  },
  {
    id: 'lch201',
    location: 'LCH201',
    name: null,
    ip: '10.2.124.21',
    host: 'prn-lab-nab201.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'yes',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.21:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: 'web'
  },
  {
    id: 'lch202',
    location: 'LCH202',
    name: null,
    ip: '10.2.124.22',
    host: 'prn-lab-nab202.ln.edu.hk',
    brand: 'HP',
    model: 'Laser Jet Pro 4003dn',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'https://10.2.124.22', driver: 'HP Designjet T920 PostScript' },
      { uri: 'socket://10.2.124.22:9100', driver: 'HP LaserJet Pro 4003 Postscript' }
    ],
    mobile: null
  },
  {
    id: 'lch204',
    location: 'LCH204',
    name: null,
    ip: '10.2.124.23',
    host: 'prn-lab-nab204.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'yes',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.23:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: 'web'
  },
  {
    id: 'lch206',
    location: 'LCH206',
    name: null,
    ip: '10.2.124.24',
    host: 'prn-lab-nab206.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'yes',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.24:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: 'web'
  },
  {
    id: 'lch206a-b-w-copier',
    location: 'LCH206A',
    name: 'B&W Copier',
    ip: '203.188.127.234',
    host: 'prn-lab-lch206a-bw.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM 7000',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'no',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.234', driver: 'Ricoh IM 7000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'lch206a-colour-copier',
    location: 'LCH206A',
    name: 'Colour Copier',
    ip: '203.188.127.235',
    host: 'prn-lab-lch206a-colour.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM C6010',
    features: {
      colour: 'yes',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'no',
      campusMac: 'unknown',
      personalWindows: 'no',
      personalMac: 'no',
      personalLinux: 'no',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'yes',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.235', driver: 'Ricoh IM C6000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'lch209',
    location: 'LCH209',
    name: null,
    ip: '10.2.124.25',
    host: 'prn-lab-nab209.ln.edu.hk',
    brand: 'HP',
    model: 'LaserJet P3015',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'yes',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.25:9100', driver: 'HP LaserJet P3010 Series Postscript' }
    ],
    mobile: 'web'
  },
  {
    id: 'lch213-b-w-copier',
    location: 'LCH213',
    name: 'B&W Copier',
    ip: '203.188.127.237',
    host: 'prn-lab-lch213-bw.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM 7000',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'no',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.237', driver: 'Ricoh IM C6000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'mb202-b-w-copier',
    location: 'MB202',
    name: 'B&W Copier',
    ip: '203.188.127.236',
    host: 'prn-lab-mb202-bw.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM 7000',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'no',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.236', driver: 'Ricoh IM 7000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'sekg02-b-w-copier-01',
    location: 'SEKG02',
    name: 'B&W Copier 01',
    ip: '203.188.127.232',
    host: 'prn-lab-sekg02-bw.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM 7000',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'no',
      copy: 'yes',
      nfcOctopus: 'no',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.232', driver: 'Ricoh IM 7000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'sekg02-b-w-copier-02',
    location: 'SEKG02',
    name: 'B&W Copier 02',
    ip: '203.188.127.233',
    host: 'prn-lab-sekg02-bw-2.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM 7000',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'no',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.233', driver: 'Ricoh IM 7000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'sekg02-colour-copier',
    location: 'SEKG02',
    name: 'Colour Copier',
    ip: '203.188.127.231',
    host: 'prn-lab-sekg02-colour.ln.edu.hk',
    brand: 'RICOH',
    model: 'IM C6010',
    features: {
      colour: 'yes',
      bw: 'yes',
      a4: 'yes',
      a3: 'yes',
      duplex: 'yes',
      campusWindows: 'no',
      campusMac: 'unknown',
      personalWindows: 'no',
      personalMac: 'no',
      personalLinux: 'no',
      webPdf: 'no',
      android: 'yes',
      ios: 'yes',
      scanToEmail: 'yes',
      copy: 'yes',
      nfcOctopus: 'yes',
      charged: 'yes',
      selfPaper: 'no'
    },
    queues: [
      { uri: 'lpd://203.188.127.231', driver: 'Ricoh IM C6000 PDF' }
    ],
    mobile: 'ricohApp'
  },
  {
    id: 'sekg03',
    location: 'SEKG03',
    name: null,
    ip: '10.2.124.31',
    host: 'prn-lab-sek105.ln.edu.hk',
    brand: 'HP',
    model: 'Laser Jet Pro 4003dn',
    features: {
      colour: 'no',
      bw: 'yes',
      a4: 'yes',
      a3: 'no',
      duplex: 'yes',
      campusWindows: 'yes',
      campusMac: 'unknown',
      personalWindows: 'untested',
      personalMac: 'untested',
      personalLinux: 'yes',
      webPdf: 'no',
      android: 'no',
      ios: 'no',
      scanToEmail: 'no',
      copy: 'no',
      nfcOctopus: 'no',
      charged: 'no',
      selfPaper: 'yes'
    },
    queues: [
      { uri: 'socket://10.2.124.31:9100', driver: 'HP LaserJet Pro 4003 Postscript' }
    ],
    mobile: null
  },
]

