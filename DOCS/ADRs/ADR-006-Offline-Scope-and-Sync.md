# ADR-006: Offline Scope & Sync Policies

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

Internet connectivity in some Kenyan clinic branches may be unstable. The system must tolerate short-term network outages without entirely halting operations. However, full offline-first architectures (like CouchDB/PouchDB) introduce extreme complexity regarding conflict resolution, especially for sensitive inventory and clinical data.

We need to define exactly what functions remain available offline and how data is synchronized when connectivity is restored.

## 2. Decision Drivers

* **Patient Safety:** We cannot risk two clinicians prescribing interacting drugs simultaneously while offline.
* **Inventory Integrity:** We cannot sell the same physical box of medicine twice.
* **Complexity:** Full bidirectional sync is too expensive to build for the MVP.

## 3. Considered Options

1. **Full Offline-First (Local DB sync):** Every branch runs a local database that syncs bi-directionally with the cloud. Extremely complex; high risk of merge conflicts.
2. **Strictly Online-Only:** The app ceases to function without the internet. Halts business during ISP outages.
3. **Degraded Offline Mode (Append-Only Events):** The application caches core master data locally. During an outage, users can perform a strictly limited set of actions (e.g., cash sales) that are stored as append-only events and pushed to the server upon reconnection.

## 4. Decision Outcome

**Chosen option:** Option 3 (Degraded Offline Mode with Append-Only Events).

We will use the browser's `IndexedDB` (via a wrapper like Dexie.js or localForage) to cache essential master data (product catalogues, price lists, active patients).

When offline, the system enters a distinct **"Offline Mode"** UI. Complex clinical operations (prescribing new treatments, ordering labs, processing insurance claims) are **blocked**. Operations are restricted to:

- Cash sales of basic products.
- Recording temporary clinical notes (saved as drafts).
- Queuing patients with temporary offline IDs.

### Positive Consequences

* **Safety:** Prevents clinical data conflicts and overselling inventory.
* **Business Continuity:** The pharmacy can still sell retail items and OTC drugs during an outage.
* **Simplicity:** The sync logic is unidirectional (Client → Server push of discrete events) rather than bi-directional merging.

### Negative Consequences

* **Reduced Functionality:** Insurance claims, eTIMS validation, and complex prescribing are impossible until internet is restored.
* **Sync Failures:** If a cached price is outdated and a sale is made offline, the server will detect a price discrepancy upon sync.

## 5. Implementation Notes

* The frontend will use a Service Worker to detect `navigator.onLine` and API connection drops.
* Offline actions are serialized as JSON payloads in an `IndexedDB` sync queue.
* **Idempotency:** Every offline action must generate a UUID v4 on the client. When syncing, the server uses this UUID as an idempotency key to prevent double-processing if the network drops during the sync request.
* **Conflict Resolution:** In case of an inventory conflict (e.g., offline sale of an item that was sold out online), the server accepts the sale (as the physical item has already left the store) but flags the stock batch as negative, triggering a mandatory stock reconciliation task for the branch manager.
