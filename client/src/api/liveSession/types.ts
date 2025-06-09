// File: src/api/liveSession/types.ts

/**
 * DTO voor een publieke LiveSession zoals gereturned door GET /api/livesession/public/{id}
 */
export interface LiveSessionDto {
  id: string;
  verhuurderId: string;
  groep: string;
  verantwoordelijkeNaam: string;
  verantwoordelijkeTel: string;
  verantwoordelijkeMail: string;
  aankomst: string;  // ISO datum-string
  vertrek: string;   // ISO datum-string
  tourId: string;
  tourName: string;
  startDate: string; // ISO datum-string
  isActive: boolean;
  creatorId: string;
  fases: Record<string, SectionSnapshot[]>;            // key = faseNaam (bijv. "voor"), value = array secties
  responses: Record<string, Record<string, any>>;      // sectionId → componentId → ingevulde waarde
}

/**
 * Snapshot van een Section binnen een Tour/LiveSession
 */
export interface SectionSnapshot {
  id: string;
  naam: string;
  components: ComponentSnapshot[];
}

/**
 * Snapshot van een Component binnen een Section
 */
export interface ComponentSnapshot {
  id: string;
  type: string;
  props: Record<string, any>;
}

/**
 * Payload voor starten van een nieuwe sessie via POST /api/livesession/start
 */
export interface StartSessionDto {
  verhuurderId: string;
  groep: string;
  verantwoordelijkeNaam: string;
  verantwoordelijkeTel: string;
  verantwoordelijkeMail: string;
  aankomst: string;    // ISO datum-string
  vertrek: string;     // ISO datum-string
  tourId: string;
  tourName: string;
  sectionIds: string[];
}

/**
 * DTO voor één veld-patch via PATCH /api/livesession/{id}/sections/{sectionId}/components/{componentId}
 */
export interface PatchFieldDto {
  sectionId: string;
  componentId: string;
  value: any;
}

/**
 * DTO voor bulk-opslaan van responses via POST /api/livesession/{id}/responses/bulk
 */
export interface BulkResponsesDto {
  responses: Record<string, Record<string, any>>;
}

/**
 * DTO voor het resultaat van een file-upload via 
 * POST /api/livesession/{id}/sections/{sectionId}/components/{componentId}/upload
 */
export interface MediaItemDto {
  id: string;
  filename: string;
  contentType: string;
  alt: string;
  styles: string;
  timestamp: string;  // ISO datum-string
  url: string;        // SAS-url naar Azure Blob
}
