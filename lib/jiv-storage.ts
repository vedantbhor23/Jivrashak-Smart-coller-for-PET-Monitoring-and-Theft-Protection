export type StoredUser = {
  ownerMobile: string;
  simMobile: string;
  passwordHash: string; // SHA-256 hex (demo-grade; use a backend in production)
};

export type JivCsvRecord = {
  petId: string;
  uploadedAt: string; // ISO
  points: Array<{
    timestampISO: string;
    temperatureC?: number;
    heartRateBpm?: number;
    latitude?: number;
    longitude?: number;
    activity?: number | string;
  }>;
};

export type AlertEvent = {
  timeISO: string;
  parameter: "Temperature" | "Heart Rate" | "Movement" | "Tamper";
  value: string;
  status: "Normal" | "Warning" | "Critical";
  alertType:
    | "Fever Alert"
    | "Hypothermia Alert"
    | "Critical Alert"
    | "Bradycardia"
    | "Tachycardia"
    | "Sudden Movement"
    | "No Movement"
    | "Tamper Alert";
};

const USERS_KEY = "jivrakshak:users";
const ACTIVE_PET_KEY = "jivrakshak:activePetId";
const CSV_KEY_PREFIX = "jivrakshak:csv:";
const ALERTS_KEY_PREFIX = "jivrakshak:alerts:";
const PET_PROFILE_KEY_PREFIX = "jivrakshak:pet-profile:";
const BLOGS_KEY_PREFIX = "jivrakshak:blogs:";
const VET_REQUESTS_KEY_PREFIX = "jivrakshak:vet-requests:";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getActivePetId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PET_KEY);
}

export function setActivePetId(petId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_PET_KEY, petId);
}

export function getUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  return safeParse<Record<string, StoredUser>>(
    window.localStorage.getItem(USERS_KEY),
    {}
  );
}

export function setUsers(users: Record<string, StoredUser>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser(petId: string): StoredUser | null {
  const users = getUsers();
  return users[petId] ?? null;
}

export function upsertUser(petId: string, user: StoredUser) {
  const users = getUsers();
  users[petId] = user;
  setUsers(users);
}

export function loadCsvRecord(petId: string): JivCsvRecord | null {
  if (typeof window === "undefined") return null;
  return safeParse<JivCsvRecord | null>(
    window.localStorage.getItem(CSV_KEY_PREFIX + petId),
    null
  );
}

export function saveCsvRecord(record: JivCsvRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CSV_KEY_PREFIX + record.petId, JSON.stringify(record));
}

export function loadAlerts(petId: string): AlertEvent[] {
  if (typeof window === "undefined") return [];
  return safeParse<AlertEvent[]>(
    window.localStorage.getItem(ALERTS_KEY_PREFIX + petId),
    []
  );
}

export function saveAlerts(petId: string, alerts: AlertEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ALERTS_KEY_PREFIX + petId, JSON.stringify(alerts));
}

export type PetProfile = {
  petId: string;
  petName: string;
  breed: string;
  ageYears: number | "";
  weightKg: number | "";
  ownerName: string;
  medicalNotes: string;
  registrationStatus: "Active" | "Inactive";
  linkedSimMobile: string;
  lastUpdatedISO: string;
};

export function loadPetProfile(petId: string): PetProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<PetProfile | null>(
    window.localStorage.getItem(PET_PROFILE_KEY_PREFIX + petId),
    null
  );
}

export function savePetProfile(profile: PetProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PET_PROFILE_KEY_PREFIX + profile.petId,
    JSON.stringify(profile)
  );
}

export type BlogPost = {
  id: string;
  category: "Recipes" | "Pet Care";
  bloggerName: string;
  title: string;
  content: string;
  createdAtISO: string;
  status: "Pending" | "Published";
};

export function loadBlogs(category: "Recipes" | "Pet Care"): BlogPost[] {
  if (typeof window === "undefined") return [];
  return safeParse<BlogPost[]>(
    window.localStorage.getItem(BLOGS_KEY_PREFIX + category),
    []
  );
}

export function saveBlogs(category: "Recipes" | "Pet Care", posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BLOGS_KEY_PREFIX + category, JSON.stringify(posts));
}

export type VetAppointmentRequest = {
  id: string;
  petOwnerName: string;
  mobileNumber: string;
  petName: string;
  petId: string;
  issueDescription: string;
  preferredDate: string;
  preferredTime: string;
  createdAtISO: string;
};

export function loadVetRequests(): VetAppointmentRequest[] {
  if (typeof window === "undefined") return [];
  return safeParse<VetAppointmentRequest[]>(
    window.localStorage.getItem(VET_REQUESTS_KEY_PREFIX),
    []
  );
}

export function saveVetRequests(requests: VetAppointmentRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VET_REQUESTS_KEY_PREFIX, JSON.stringify(requests));
}

