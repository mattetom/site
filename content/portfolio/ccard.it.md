---
title: CCard
date: 2026-08-21T10:00:00+00:00
draft: false
thumbnail: images/portfolio/ccard-feature.png
hideMainImage: true
service: "Sviluppo app mobile, Architettura offline-first"
client: Progetto personale
shortDescription: "CCard raccoglie tutte le tue carte fedeltà in un unico posto: le scansioni una volta e le ritrovi alla cassa, tutto offline e senza registrazione."
challenge: "Le tessere fedeltà si accumulano nel portafoglio e nel portachiavi, e le app che esistono chiedono un account prima ancora di essere utili, per poi monetizzare con pubblicità e tracciamento."
solution: "Ho costruito un portafoglio che vive sul telefono, dove aggiungere una carta richiede pochi secondi e mostrarla alla cassa un tap solo, con il backup nel cloud offerto come acquisto una tantum invece che come abbonamento."
screenshots:
  - images/portfolio/ccard-store-1.png
  - images/portfolio/ccard-store-2.png
  - images/portfolio/ccard-store-3.png
  - images/portfolio/ccard-store-4.png
playStoreURL: https://play.google.com/store/apps/details?id=com.matteotomasini.ccard
# appStoreURL: https://apps.apple.com/app/ccard/id6803530507
# ^ da scommentare quando la versione iOS supera la review App Store (inviata il 21/08/2026)
---
CCard nasce da un fastidio piccolo e del tutto ordinario: un portafoglio che non si chiude più, pieno di tessere del supermercato e della farmacia che servono tre secondi alla volta.

Le app già disponibili risolvevano il problema dell'ingombro introducendone di peggiori. Quasi tutte pretendono la creazione di un account prima ancora che si possa aggiungere la prima carta, parecchie mostrano pubblicità proprio nel momento in cui la cassiera sta aspettando, e i dati delle tessere finiscono per impostazione predefinita sul server di qualcun altro. L'obiettivo di CCard è stato ribaltare quelle impostazioni predefinite.

## Obiettivi del progetto

- Rendere l'aggiunta di una carta questione di secondi, non di un modulo da compilare.
- Funzionare completamente offline, senza account e senza barriere di registrazione.
- Tenere veloce e affidabile il momento della cassa, perché è lì che l'app viene davvero usata.
- Far pagare una volta sola l'unica funzione che ha un costo reale di gestione, invece di affittare l'app ogni mese.

## Direzione di prodotto

L'app è costruita attorno a due momenti, e a quasi nient'altro.

**Aggiungere una carta.** Il codice si acquisisce con la fotocamera oppure si importa da una foto già in galleria. Il negozio si sceglie da un catalogo di loghi integrato, così la tessera è riconoscibile a colpo d'occhio, e qualsiasi punto vendita assente dal catalogo può essere aggiunto come carta personalizzata. Note e ricerca tengono utilizzabile anche una raccolta numerosa.

**Mostrare una carta.** Il codice riempie lo schermo e la luminosità del dispositivo si alza da sola, che è la differenza fra un lettore che legge al primo colpo e la coda dietro che si allunga. Sono supportati sia i codici a barre (Code 128) sia i QR code.

Tutto quello sopra è gratuito e senza limiti. Nessun tetto al numero di carte, nessuna filigrana, nessuna pubblicità, nessun account.

## Gratis e Premium

La divisione segue una regola semplice: quello che gira sul telefono è gratis, quello che gira su un server si paga.

CCard Premium è un **acquisto una tantum**, non un abbonamento. Aggiunge il backup nel cloud e la sincronizzazione fra più dispositivi tramite accesso con Google, così un telefono perso o sostituito non significa riscansionare quaranta tessere. Si compra una volta e resta tuo.

È stata una scelta deliberata sul prezzo. Un portafoglio di tessere fedeltà è un'utilità che le persone si aspettano di tenere per anni, e un addebito ricorrente su un'utilità invita alla disdetta molto più di quanto inviti al rinnovo.

## Scelte tecniche e di esperienza d'uso

- **Archiviazione locale prima di tutto.** Le carte vivono in un database SQLite locale gestito con Drift. La sincronizzazione cloud è uno strato aggiuntivo, non la fonte di verità, quindi l'app resta pienamente funzionante con la rete spenta.
- **Sincronizzazione costruita per reggere i conflitti.** La sincronizzazione multi-dispositivo è la funzione che più facilmente perde dati in silenzio, per questo è stata coperta da test contro un Firestore reale invece che data per buona a vista.
- **Scansione sul dispositivo.** Il riconoscimento dei codici avviene localmente tramite ML Kit: i codici delle tessere non vengono mai inviati altrove per essere elaborati.
- **Luminosità automatica.** Un dettaglio minimo che domina l'esperienza reale: lo schermo si illumina quando il codice si apre e torna com'era quando si chiude.
- **Bilingue fin dall'inizio.** Italiano e inglese, in linea con le schede degli store.

## Privacy

Le carte restano sul dispositivo a meno che il backup cloud non venga attivato esplicitamente. Non c'è pubblicità e non c'è tracciamento, ed è anche il motivo per cui l'app chiede pochissimi permessi: la fotocamera per scansionare, e nient'altro finché non si acquista il Premium.

## Perché questo progetto conta

CCard è un esempio di problema piccolo risolto per bene, invece che di problema grande risolto a metà. Le funzioni non sono difficili da descrivere, ed è esattamente il punto: il lavoro è finito nelle impostazioni predefinite, nel comportamento offline e in quel secondo di luminosità alla cassa, perché sono le parti che decidono se l'app viene usata una seconda volta.

- Informativa privacy: [matteotomasini.com/privacy/ccard/](/privacy/ccard/)
- Cancellazione account: [matteotomasini.com/ccard/delete_account/](/ccard/delete_account/)
