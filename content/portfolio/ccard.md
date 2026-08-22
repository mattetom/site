---
title: CCard
date: 2026-08-21T10:00:00+00:00
draft: false
thumbnail: images/portfolio/ccard-feature.png
hideMainImage: true
service: "Mobile App Development, Offline-First Architecture"
client: Personal Project
shortDescription: "CCard keeps every loyalty card in one place, scanned once and ready at checkout, working fully offline with no account required."
challenge: "Loyalty cards pile up in wallets and keychains, and the existing apps ask for an account before they do anything useful, then monetise attention with ads and tracking."
solution: "I built a local-first wallet where scanning a card takes seconds and showing it at the till takes one tap, with cloud backup offered as an optional one-time purchase instead of a subscription."
screenshots:
  - images/portfolio/ccard-store-1.png
  - images/portfolio/ccard-store-2.png
  - images/portfolio/ccard-store-3.png
  - images/portfolio/ccard-store-4.png
playStoreURL: https://play.google.com/store/apps/details?id=com.matteotomasini.ccard
# appStoreURL: https://apps.apple.com/app/ccard/id6803530507
# ^ uncomment once the iOS version clears App Store review (submitted 2026-08-21)
---
CCard started from a small, entirely ordinary annoyance: a wallet too thick to close, stuffed with supermarket and pharmacy cards that only get used for three seconds at a time.

The apps already available solved the storage problem but introduced worse ones. Most of them require creating an account before the first card can even be added, several show ads at the exact moment the cashier is waiting, and the card data ends up on someone else's server by default. The goal for CCard was to invert those defaults.

## Project goals

- Make adding a card take seconds, not a form.
- Work completely offline, with no account and no sign-up wall.
- Keep the checkout moment fast and reliable, because that is when the app is actually used.
- Charge once for the only feature that genuinely costs money to run, rather than renting the app monthly.

## Product direction

The app is built around two moments, and almost nothing else.

**Adding a card.** The barcode is captured with the camera or imported from a photo already in the gallery. The store is picked from a built-in catalogue of brand logos, so the card is recognisable at a glance, and any shop missing from the catalogue can be added as a custom card. Notes and search keep a large collection usable.

**Showing a card.** The code fills the screen and the device brightness is raised automatically, which is the difference between a scanner reading it on the first pass and the queue behind you growing. Both Code 128 barcodes and QR codes are supported.

Everything above is free and unlimited. There is no card cap, no watermark, no advertising, and no account.

## Free and Premium

The split follows a simple rule: what runs on the phone is free, what runs on a server is paid.

CCard Premium is a **one-time purchase**, not a subscription. It adds cloud backup and multi-device sync through Google Sign-In, so a lost or replaced phone does not mean re-scanning forty cards. Buy it once, keep it.

This was a deliberate pricing decision. A loyalty card wallet is a utility that people expect to keep for years, and a recurring charge on a utility invites cancellation far more than it invites renewal.

## Technical and UX decisions

- **Local-first storage.** Cards live in a local SQLite database via Drift. Cloud sync is an additive layer on top, not the source of truth, so the app is fully functional with the network off.
- **Sync built to survive conflicts.** Multi-device sync is the feature most likely to lose data quietly, so it was covered with tests against a real Firestore emulator rather than trusted by inspection.
- **On-device scanning.** Barcode recognition runs locally through ML Kit, so card codes are never sent anywhere for processing.
- **Automatic brightness.** A small detail that dominates the actual user experience: the screen brightens when the code opens and restores when it closes.
- **Bilingual from the start.** Italian and English, matching the store listings.

## Privacy

Cards stay on the device unless cloud backup is explicitly enabled. There is no advertising and no tracking, which is also why the app asks for so few permissions: the camera to scan, and nothing else until Premium is purchased.

## Why this project matters

CCard is a case of solving a small problem properly rather than a large problem partially. The functionality is not hard to describe, which is precisely the point: the work went into the defaults, the offline behaviour, and the one second of brightness at the till, because those are the parts that decide whether the app gets used a second time.

- Privacy policy: [matteotomasini.com/privacy/ccard/](/privacy/ccard/)
- Account deletion: [matteotomasini.com/ccard/delete_account/](/ccard/delete_account/)
