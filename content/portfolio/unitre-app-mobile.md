---
title: UNITRE Tradate — App Mobile
date: 2026-03-27T10:00:00+00:00
draft: false
thumbnail: images/portfolio/unitre-app-feature.png
hideMainImage: true
service: Mobile App Development, Flutter, Push Notifications
client: UNITRE Tradate
screenshots:
  - images/portfolio/unitre-app-screen1.webp
  - images/portfolio/unitre-app-screen2.webp
  - images/portfolio/unitre-app-screen3.webp
  - images/portfolio/unitre-app-screen4.webp
  - images/portfolio/unitre-app-screen5.webp
  - images/portfolio/unitre-app-screen6.webp
  - images/portfolio/unitre-app-screen7.webp
shortDescription: App mobile companion per i soci di UNITRE Tradate — permette di consultare i corsi a cui si è iscritti, visualizzare il calendario delle lezioni, ricevere notifiche push e promemoria personalizzati, e scaricare il materiale didattico. Disponibile per Android e iOS.
challenge: I soci di UNITRE Tradate avevano bisogno di un accesso rapido e mobile alle informazioni sui propri corsi, orari e comunicazioni dell'associazione. Il portale web, pur completo, non era ottimizzato per l'uso quotidiano da smartphone — controllare un orario o ricevere un avviso richiedeva aprire il browser, autenticarsi e navigare nel sito.
solution: Ho sviluppato un'app mobile cross-platform in Flutter che si integra con il gestionale web esistente tramite API REST dedicate. L'app offre login sicuro con token JWT, vista dei corsi e del calendario, notifiche push via Firebase Cloud Messaging, promemoria locali configurabili e accesso ai materiali didattici — tutto in un'interfaccia nativa, veloce e pensata per l'uso quotidiano.
---

L'app mobile è nata come estensione naturale del [gestionale web UNITRE Tradate](/portfolio/unitre-gestionale/) — un modo per portare le informazioni più importanti direttamente in tasca ai soci, senza dover accedere ogni volta al portale completo.

## Funzionalità principali

**Home e riepilogo** — La schermata principale mostra un riepilogo immediato: i corsi a cui il socio è iscritto, lo stato delle iscrizioni e le ultime news dell'associazione.

**I miei corsi** — Elenco dei corsi con giorno, orario, stato dell'iscrizione (pagato, confermato, in attesa) e accesso ai dettagli del corso con possibilità di scaricare materiale didattico e allegati.

**Calendario** — Visualizzazione calendario con le lezioni della settimana e del mese, per avere sempre sott'occhio gli impegni.

**Notifiche push** — Comunicazioni in tempo reale dall'associazione tramite Firebase Cloud Messaging: avvisi su variazioni di orario, eventi, news e comunicazioni generali.

**Promemoria locali configurabili** — Due tipi di reminder:
- Riepilogo giornaliero dei corsi del giorno, con orario personalizzabile (es. alle 8:00 del mattino)
- Promemoria pre-lezione, configurabile in ore o minuti prima dell'inizio

**Profilo e preferenze** — Gestione delle preferenze di notifica direttamente dall'app, con sincronizzazione automatica col backend.

## Scelte tecniche

- **Flutter** per una codebase unica Android/iOS con esperienza nativa su entrambe le piattaforme.
- **Autenticazione JWT** con refresh token automatico (finestra di 30 giorni) e storage sicuro tramite Keychain (iOS) e Keystore (Android).
- **Firebase Cloud Messaging** per notifiche push affidabili, con registrazione automatica del token FCM sul backend.
- **Notifiche locali schedulate** tramite `flutter_local_notifications`, con ricalcolo automatico ad ogni avvio dell'app.
- **Integrazione API REST** con il gestionale web — endpoint dedicati (`/api/mobile/*`) per login, corsi, allegati, news e preferenze.
- **Multi-environment** — configurazione separata per sviluppo locale, UAT e produzione.
- **Firebase Analytics** per tracciare l'utilizzo e migliorare l'esperienza nel tempo.

## Tech stack

- **Framework:** Flutter (Dart 3.9+)
- **Piattaforme:** Android (SDK 21+) e iOS
- **Backend:** API REST del gestionale Next.js
- **Auth:** JWT con refresh automatico, flutter_secure_storage
- **Notifiche:** Firebase Cloud Messaging + flutter_local_notifications
- **Analytics:** Firebase Analytics
- **UI:** Material Design con componenti personalizzati, table_calendar per il calendario

## Rapporto con il gestionale web

L'app non duplica il gestionale — lo complementa. Mentre il portale web resta lo strumento per l'amministrazione completa (iscrizioni, pagamenti, gestione corsi, back-office), l'app mobile è il punto di contatto quotidiano del socio: controllare a che ora è la lezione, ricevere un avviso se cambia l'orario, scaricare il materiale del corso.

Questa separazione di responsabilità — gestione completa sul web, consultazione rapida su mobile — è il modello che permette di offrire un'esperienza ottimale su entrambi i canali senza duplicare logica o complessità.
