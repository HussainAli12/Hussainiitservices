import { companyInfo } from "@/lib/constants";

export interface OfficeContact {
  id: "ujjain" | "dubai";
  name: string;
  city: string;
  region?: string;
  country: string;
  countryCode: "IN" | "AE";
  phones: { label: string; display: string; href: string }[];
  whatsapp: { display: string; href: string };
  latitude: number;
  longitude: number;
}

/**
 * Our two offices, using only the contact details already published on the site.
 * No street addresses are listed on the site yet, so none are emitted in schema.
 *
 * TODO(contact): the only WhatsApp number on the site is the India one (+91 7024951915).
 * If the UAE number (+971 55 365 9826) is on WhatsApp, set dubai.whatsapp to
 * { display: "+971 55 365 9826", href: "https://wa.me/971553659826" }.
 * TODO(contact): add street address + postcode for each office to strengthen LocalBusiness schema.
 */
export const offices: Record<OfficeContact["id"], OfficeContact> = {
  ujjain: {
    id: "ujjain",
    name: `${companyInfo.name} — Ujjain`,
    city: "Ujjain",
    region: "Madhya Pradesh",
    country: "India",
    countryCode: "IN",
    phones: companyInfo.phones.filter((phone) => phone.label === "India"),
    whatsapp: companyInfo.whatsapp,
    latitude: 23.1765,
    longitude: 75.7885,
  },
  dubai: {
    id: "dubai",
    name: `${companyInfo.name} — Dubai`,
    city: "Dubai",
    region: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    phones: companyInfo.phones.filter((phone) => phone.label === "UAE"),
    whatsapp: companyInfo.whatsapp,
    latitude: 25.2048,
    longitude: 55.2708,
  },
};

/** India pages → Ujjain office; UAE, Saudi and wider GCC → Dubai office */
export function officeForCountry(country: string): OfficeContact {
  return country === "India" ? offices.ujjain : offices.dubai;
}

/** WhatsApp deep link with a prefilled message */
export function whatsappLink(office: OfficeContact, message: string) {
  return `${office.whatsapp.href}?text=${encodeURIComponent(message)}`;
}
