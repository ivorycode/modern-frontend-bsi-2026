export interface Produkt {
  id: string;
  name: string;
  beschreibung: string;
  leistungen: string[];
}

/** Produktkatalog: ändert sich nur mit einem neuen Release. */
export const PRODUKTE: Produkt[] = [
  {
    id: 'hausrat',
    name: 'Hausratversicherung',
    beschreibung: 'Schützt Ihr Hab und Gut zu Hause gegen Feuer, Wasser, Diebstahl und Elementarschäden.',
    leistungen: ['Feuer und Elementar', 'Wasserschaden', 'Diebstahl zu Hause', 'Glasbruch (optional)'],
  },
  {
    id: 'haftpflicht',
    name: 'Privathaftpflicht',
    beschreibung: 'Deckt Schäden, die Sie oder Ihre Familie Dritten zufügen.',
    leistungen: ['Personenschäden', 'Sachschäden', 'Mieterschäden', 'Abwehr unberechtigter Ansprüche'],
  },
  {
    id: 'motorfahrzeug',
    name: 'Motorfahrzeugversicherung',
    beschreibung: 'Haftpflicht, Teil- und Vollkasko für Ihr Auto oder Motorrad.',
    leistungen: ['Haftpflicht', 'Teilkasko (Hagel, Diebstahl, Glas)', 'Vollkasko', 'Assistance 24/7'],
  },
  {
    id: 'reise',
    name: 'Reiseversicherung',
    beschreibung: 'Annullierungskosten, Personen-Assistance und Reisegepäck weltweit.',
    leistungen: ['Annullierungskosten', 'Rücktransport', 'Reisegepäck', 'Mietwagen-Selbstbehalt'],
  },
];
