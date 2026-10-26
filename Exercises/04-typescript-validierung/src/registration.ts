export type RegistrationStatus = "confirmed" | "waitlist" | "cancelled";

/** Eine Kursanmeldung, wie sie die API liefert. */
export interface Registration {
  id: number;
  name: string;
  email: string;
  status: RegistrationStatus;
  /** Sitzplatz; nur bei bestätigten Anmeldungen vergeben. */
  seat?: number;
}

export const STATUS_LABELS: Record<RegistrationStatus, string> = {
  confirmed: "Bestätigt",
  waitlist: "Warteliste",
  cancelled: "Storniert",
};

/** Nächste freie Anmeldenummer: eins mehr als die höchste vergebene. */
export function nextId(registrations: readonly Registration[]): number {
  let highest = 0;
  for (const registration of registrations) {
    if (registration.id > highest) highest = registration.id;
  }
  return highest + 1;
}
