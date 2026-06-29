# ADR-018: Device, Printer & Scanner Support Model

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect / Field Ops

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Frontend support per Module 10 ([#11](https://gitlab.com/cricketaustin-group/Pzure/-/issues/11)).

## 1. Context and Problem Statement

Branches use varied hardware: receipt/label printers, barcode scanners, POS terminals, tablets and phones. The platform must support these without per-branch custom builds and must keep POS fast and reliable.

## 2. Decision Drivers

- POS speed (scanner focus lock, sub-2s checkout).
- Heterogeneous, low-cost hardware in Kenyan branches.
- Supportability and a known-good device matrix.

## 3. Considered Options

1. Native per-device drivers/app.
2. Browser-based printing/scanning with a thin local print agent where needed.
3. Cloud-print only.

## 4. Decision Outcome

**Chosen (Approved):** Browser-first device support with a **device registry** and a supported **device matrix**.

- **Scanners:** keyboard-wedge mode; POS enforces **barcode focus lock** so scans always land in item search.
- **Printers:** 58mm & 80mm receipts, pharmacy/lab labels via browser print + template layouts (Module 10 print templates); optional thin local print agent for direct ESC/POS where browser printing is insufficient.
- **Device registry:** each device registered with branch, type, model, status; printer/scanner readiness shown in the relevant shell.
- **Test matrix:** maintained list of certified printer/scanner/terminal models; new models must pass the device test pack before field use.

## 5. Consequences

Avoids bespoke native builds; supportable across branches. Some printers may require the local print agent; unsupported hardware is rejected until tested.

## 6. Implementation Notes

- Device registry aggregate; printer/scanner status indicators (Module 10 §7).
- Manual + device test pack for receipts/labels (Module 10 §20); print templates versioned and tested on real devices.
