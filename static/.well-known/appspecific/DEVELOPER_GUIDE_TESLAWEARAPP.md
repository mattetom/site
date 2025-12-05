# DEVELOPER_GUIDE_TESLAWEARAPP.md
Guida completa allo sviluppo dell’app *TeslaWearApp*  
Versione: **1.0**  
Modalità operativa: **Client-only con “Modalità Intelligente”**  
Piattaforme: **Android App + WearOS App**

---

# 0. INTRODUZIONE

Questo documento descrive in modo esaustivo e prescrittivo l’implementazione dell’applicazione **TeslaWearApp**:

- Companion App Android  
- App WearOS  

L’obiettivo dell’app è permettere all’utente di controllare la propria Tesla **direttamente dall’orologio**, senza usare un backend e ottimizzando consumi e costi delle Tesla Fleet API.

L’app implementa una **modalità intelligente**:

- se il telefono è raggiungibile → usa il telefono come proxy dei comandi  
- se il telefono NON è raggiungibile → il watch invia i comandi direttamente alla Tesla Fleet API  

Tutti i comportamenti, scelte tecniche e flussi sono già definiti.  
Lo sviluppatore **non deve prendere decisioni**, deve seguire quanto riportato in questo documento.

---

# 1. RIFERIMENTI UFFICIALI TESLA

Documentazione ufficiale Tesla Fleet API (unica API supportata):

👉 https://developer.tesla.com/docs/fleet-api

Sezioni rilevanti da consultare:

- **Getting Started**  
- **Authentication** (OAuth + PKCE + API Key)  
- **Vehicle Commands**  
- **Vehicle Data**  
- **Best Practices & Cost Optimization**

L’implementazione di TeslaWearApp deve attenersi alla logica, ai flussi e ai vincoli descritti in questa documentazione.

---

# 2. ARCHITETTURA DEL PROGETTO

La soluzione è composta da due moduli Gradle all’interno dello stesso progetto Android Studio:

```text
root/
 ├── app/       # Companion Android
 └── wear/      # WearOS app
```

Caratteristiche comuni:

- Linguaggio: **Kotlin**  
- Versione Java: **17**  
- Min SDK:
  - Android: **26**
  - WearOS: **30**  
- Comunicazione tra telefono e orologio tramite **Wear OS Data Layer API**:
  - `MessageClient` per comandi veloci  
  - `DataClient` per sincronizzazione credenziali e stato veicolo  

Non è previsto alcun backend esterno: tutte le logiche risiedono tra **telefono** e **orologio**, con chiamate dirette alle Tesla Fleet API.

---

# 3. DIPENDENZE

Usare le seguenti dipendenze (o versioni successive compatibili) come base minima.

## 3.1 Companion App (`app/build.gradle`)

```gradle
dependencies {
    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")

    // Crypto e storage sicuro
    implementation("androidx.security:security-crypto:1.1.0-alpha06")

    // Wearable Data Layer
    implementation("com.google.android.gms:play-services-wearable:18.1.0")

    // OAuth2 con PKCE
    implementation("net.openid:appauth:0.11.1")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}
```

## 3.2 WearOS App (`wear/build.gradle`)

```gradle
dependencies {
    // Tiles (eventualmente usate in futuro)
    implementation("androidx.wear.tiles:tiles-material:1.4.0")
    implementation("androidx.wear.tiles:tiles-proto:1.4.0")

    // Wearable Data Layer
    implementation("com.google.android.gms:play-services-wearable:18.1.0")

    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")

    // Crypto
    implementation("androidx.security:security-crypto:1.1.0-alpha06")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}
```

---

# 4. SICUREZZA E GESTIONE SEGRETI

## 4.1 API Key Tesla (a carico dell’utente)

Ogni utente di TeslaWearApp deve:

1. Registrarsi sul portale Tesla Developer.  
2. Creare una **Tesla Fleet API Key personale**.  
3. Inserire manualmente questa API Key all’interno della companion app.

Questa scelta garantisce che:

- Il billing delle chiamate API ricada sull’account Tesla dell’utente.  
- L’utente sfrutti il credito mensile gratuito (10$) previsto per uso personale.  
- L’autore di TeslaWearApp non sostenga costi di API per gli utenti.  

La companion app deve quindi usare **sempre e solo** l’API Key inserita dall’utente per:

- avviare il flusso OAuth2 con PKCE;  
- ottenere i token (access_token, refresh_token);  
- effettuare le chiamate verso Tesla Fleet API.

## 4.2 Storage sicuro dei token sul telefono

I seguenti dati devono essere memorizzati sul dispositivo Android usando `EncryptedSharedPreferences`:

- `api_key`  
- `access_token`  
- `access_token_expiry` (timestamp in ms)  
- `refresh_token`  
- `vehicle_list_json` (JSON della lista veicoli)  
- `vehicle_id_selected` (veicolo attivo)  
- `last_vehicle_state_json` (ultimo stato completo)  
- `last_state_timestamp` (timestamp ultimo aggiornamento stato)

Esempio di setup:

```kotlin
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val securePrefs = EncryptedSharedPreferences.create(
    context,
    "teslawear_creds",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
```

Tutti i valori sensibili (API Key, token) devono essere memorizzati in `securePrefs`.

## 4.3 Sincronizzazione credenziali verso il watch

Il telefono non deve inviare token in chiaro al watch.

Flow:

1. Sul telefono, prendere `api_key` e `refresh_token`.  
2. Criptarli con una chiave simmetrica (AES) generata sul telefono.  
3. Inviare:
   - `encrypted_api_key`
   - `encrypted_refresh_token`
   - `vehicle_id_selected`
   - `last_vehicle_state_json`
   - `last_state_timestamp`
   tramite `DataClient` (`PutDataMapRequest`) con path `/tesla/credentials`.

Sul watch, i dati criptati vengono ricevuti, e:

- `encrypted_api_key` e `encrypted_refresh_token` vengono decriptati usando una chiave AES memorizzata nel Keystore del watch.  
- `vehicle_id_selected` e lo stato vengono salvati in preferenze locali.

## 4.4 Keystore e chiavi sul watch

Sul watch va generata una chiave AES nel Keystore:

```kotlin
fun generateAesKeyIfNeeded() {
    val keyStore = java.security.KeyStore.getInstance("AndroidKeyStore").apply {
        load(null)
    }
    if (!keyStore.containsAlias("wear_aes_key")) {
        val keyGen = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )
        keyGen.init(
            KeyGenParameterSpec.Builder(
                "wear_aes_key",
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build()
        )
        keyGen.generateKey()
    }
}
```

I token sul watch sono sempre memorizzati solo in forma cifrata, usando questa chiave.

---

# 5. FLUSSO COMPLETO DI AUTENTICAZIONE

Il flusso di autenticazione si svolge **solo nella companion app Android**.

## 5.1 Inserimento API Key

- L’utente apre TeslaWearApp sul telefono.  
- Schermata iniziale: campo di testo per l’**API Key Tesla**.  
- Bottone: “Connetti account Tesla”.

La companion app memorizza l’API Key in `EncryptedSharedPreferences`.

## 5.2 Flusso OAuth2 + PKCE

Usare la libreria AppAuth (`net.openid:appauth`) e la documentazione Tesla per:

1. Generare `code_verifier` e `code_challenge`.  
2. Aprire la pagina di login Tesla in una Custom Tab.  
3. Ricevere il `authorization_code` nel redirect URI registrato.  
4. Scambiare il code per `access_token` e `refresh_token`.

I dati ottenuti vengono memorizzati in `EncryptedSharedPreferences` come descritto in §4.2.

## 5.3 Recupero lista veicoli

Subito dopo l’ottenimento dei token, la companion app:

1. Chiama l’endpoint Tesla Fleet `GET /api/1/vehicles`.  
2. Ottiene la lista dei veicoli associati all’account Tesla dell’utente.  
3. Salva il JSON in `vehicle_list_json`.  
4. Mostra all’utente la lista veicoli in una seconda schermata:

   - Ogni voce contiene nome, modello, eventuali dettagli.  
   - L’utente seleziona il veicolo principale (obbligatorio).  

5. `vehicle_id_selected` viene salvato e verrà sincronizzato sul watch.

## 5.4 Sincronizzazione iniziale verso il watch

Una volta selezionato il veicolo:

1. La companion app prende:
   - `api_key`
   - `refresh_token`
   - `vehicle_id_selected`
   - `last_vehicle_state_json` (se disponibile)
   - `last_state_timestamp` (se disponibile)
2. Cripta API Key e refresh token.  
3. Invia un `PutDataMapRequest` al path `/tesla/credentials`.

Il watch riceve questi dati, li decripta e li memorizza per uso successivo.

---

# 6. GESTIONE LISTA VEICOLI (CACHE + REFRESH)

## 6.1 Endpoint di lista veicoli

Endpoint Tesla Fleet:

```text
GET /api/1/vehicles
```

Autenticato con `Authorization: Bearer <access_token>`.

## 6.2 Comportamento della companion app

La companion app deve:

- Recuperare la lista veicoli:
  - al primo login;
  - quando l’utente preme esplicitamente il bottone “Aggiorna elenco veicoli”.  

- Salvare il JSON risultante in `vehicle_list_json`.

- Mostrare una schermata con:

  - Titolo: “I miei veicoli”  
  - Lista dei veicoli disponibili  
  - Un segno grafico per il veicolo selezionato come predefinito  
  - Un bottone “Aggiorna elenco” che riesegue il `GET /vehicles`  

## 6.3 Selezione veicolo attivo

- L’utente deve selezionare un veicolo attivo.  
- Il `vehicle_id_selected` viene salvato in preferenze e inviato al watch.  
- Tutti i comandi futuri (sia dal telefono che dal watch) devono usare questo `vehicle_id_selected`.

---

# 7. MODALITÀ INTELLIGENTE (DECISIONE PROXY/DIRETTO)

La logica della **modalità intelligente** è implementata nella app WearOS.

## 7.1 Obiettivo

Per ogni comando inviato dal watch (unlock, clima, set amps):

1. Verificare se il telefono è connesso e raggiungibile.  
2. Se sì → inviare il comando al telefono (proxy).  
3. Se no → verificare se il watch ha connettività (Wi‑Fi/LTE);  
   - se sì → inviare comando direttamente alle Tesla Fleet API;  
   - se no → mostrare un errore di mancanza di connessione.

## 7.2 Verifica telefono raggiungibile

Sul watch:

```kotlin
val nodes = Wearable.getNodeClient(context).connectedNodes.await()
val phoneReachable = nodes.any { it.isNearby }
```

`phoneReachable` viene considerato `true` se almeno un nodo connesso ha `isNearby == true` (telefono in prossimità).

## 7.3 Verifica rete attiva sul watch

```kotlin
val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
val hasNetwork = cm.activeNetworkInfo?.isConnected == true
```

Se `hasNetwork == false`, non è possibile eseguire chiamate dirette alle Tesla API.

## 7.4 Regola completa

Pseudocodice:

```text
if (phoneReachable) {
    → usa proxy: invia messaggio al telefono
} else if (hasNetwork) {
    → invia comando direttamente dal watch alle Tesla API
} else {
    → mostra errore "Nessuna connessione disponibile"
}
```

---

# 8. WAKE-UP DECISION ENGINE (TTL = 5 MINUTI)

Per ridurre i costi, non bisogna chiamare il comando `wake_up` inutilmente.

Si usa il concetto di **stato recente** con TTL di **5 minuti**.

## 8.1 Dati necessari sul watch

Il watch deve avere:

- `last_vehicle_state_json` → stato completo dell’auto  
- `last_state_timestamp` → timestamp (ms) dell’ultima lettura stato

Questi valori vengono:

- inizialmente sincronizzati dal telefono;  
- aggiornati ogni volta che viene fatta una lettura `/vehicle_data` di validazione.

## 8.2 Stato recente

Definizione:

```kotlin
val now = System.currentTimeMillis()
val isRecent = (now - lastStateTimestamp) < 5 * 60 * 1000L // 5 minuti
```

Se `isRecent == true` lo stato è considerato recente.

## 8.3 Regola di wake-up

Prima di inviare un comando che richiede forse il veicolo online:

```text
if (isRecent) {
    NON inviare wake_up
} else {
    inviare wake_up
    attendere 1500 ms
}
```

Il comando vero e proprio (es. unlock, set amps) viene inviato dopo l’eventuale wake-up e dopo l’attesa di 1500ms.

---

# 9. COMANDI TESLA SUPPORTATI

I comandi da implementare sono:

1. **Sblocco auto** (unlock)  
2. **Avvio clima** (climate ON)  
3. **Stop clima** (climate OFF)  
4. **Impostazione temperatura** (set temps)  
5. **Impostazione ampere di ricarica (1A–32A)** (set charging amps)

## 9.1 Door Unlock

Endpoint:

```text
POST /api/1/vehicles/{id}/command/door_unlock
```

Header:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 9.2 Clima ON

```text
POST /api/1/vehicles/{id}/command/auto_conditioning_start
```

## 9.3 Clima OFF

```text
POST /api/1/vehicles/{id}/command/auto_conditioning_stop
```

## 9.4 Set temps

```text
POST /api/1/vehicles/{id}/command/set_temps
```

Body indicativo:

```json
{
  "driver_temp": 21.0,
  "passenger_temp": 21.0
}
```

## 9.5 Set charging amps (1–32A)

```text
POST /api/1/vehicles/{id}/command/set_charging_amps
```

Body:

```json
{
  "charging_amps": 16
}
```

Il valore `charging_amps` viene scelto dall’utente tramite slider (min=1, max=32).

---

# 10. VALIDAZIONE POST-COMANDO (2 TENTATIVI)

Per ogni comando inviato (sia da telefono che da watch) è necessario **verificare** che il comando sia stato effettivamente applicato.

Si usa il pattern **“State Validation After Command”**.

## 10.1 Endpoint di lettura stato

Endpoint:

```text
GET /api/1/vehicles/{id}/vehicle_data
```

## 10.2 Regola di validazione

Dopo l’invio di un comando:

1. Attendere **1500ms**.  
2. Effettuare una richiesta `GET /vehicle_data`.  
3. Controllare se lo stato corrisponde a quello richiesto:
   - se sì → comando riuscito;  
   - se no → attendere altri **3000ms**, poi ripetere `GET /vehicle_data`.  

Se anche dopo il secondo tentativo lo stato non è coerente:

- mostrare errore di esecuzione comando all’utente.

## 10.3 Esempio Kotlin (semplificato)

```kotlin
suspend fun validateCommand(
    vehicleId: String,
    desired: (VehicleData) -> Boolean
): VehicleData {
    delay(1500)
    var data = api.getVehicleData(vehicleId)
    if (desired(data)) return data

    delay(3000)
    data = api.getVehicleData(vehicleId)
    return data
}
```

`desired` è una lambda che verifica, per quel comando, se lo stato è come atteso.

Esempio per sblocco:

```kotlin
val data = validateCommand(vehicleId) { state ->
    state.vehicleState.locked == false
}
```

Dopo la validazione, `last_vehicle_state_json` e `last_state_timestamp` devono essere aggiornati e sincronizzati verso il telefono (se necessario).

---

# 11. UI WEAROS (LAYOUT MINIMAL)

La UI sul watch deve essere **semplice e immediata**.

## 11.1 Schermata principale

Contenuti:

- Titolo o breve label “TeslaWearApp” (facoltativo).  
- Tre elementi cliccabili:

  1. **Unlock Car** (pulsante grande)
  2. **Climate Toggle** (pulsante grande)
  3. **Charging Amps** (pulsante che porta a seconda schermata)

Layout concettuale:

```text
+-----------------------------+
|        TeslaWearApp         |
+-----------------------------+
|  🔓 Unlock Car              |
|                             |
|  🔥 Climate On/Off          |
|                             |
|  🔌 Charging Amps   (→)     |
+-----------------------------+
```

- “Climate On/Off” deve comportarsi come **toggle**:
  - se il clima è off → ON  
  - se il clima è on → OFF  

Lo stato attuale del clima va derivato da `last_vehicle_state_json` quando disponibile; in caso di dubbio si assume OFF.

## 11.2 Schermata “Charging Amps”

Schermata dedicata:

- Slider (o picker) da **1A a 32A**.  
- Possibilità di muovere lo slider a step 1A.  
- Valore scelto mostrato in chiaro (es. “16 A”).  
- Pulsante “Imposta ampere”.

Flow:

1. L’utente seleziona il valore desiderato.  
2. Premendo “Imposta ampere”:
   - viene applicata la Modalità Intelligente (proxy/diretto);  
   - viene inviato il comando `set_charging_amps`;  
   - viene avviata la validazione post-comando.

---

# 12. UI COMPANION ANDROID

## 12.1 Schermata 1 — Inserimento API Key

Elementi:

- Titolo: “Collega il tuo account Tesla”.  
- Campo di testo per **API Key Tesla**.  
- Bottone: “Connetti account Tesla”.

Alla pressione del bottone:

- salvare l’API Key in `EncryptedSharedPreferences`;  
- avviare il flusso OAuth2+PKCE;  
- alla fine, proseguire alla schermata di lista veicoli.

## 12.2 Schermata 2 — Lista veicoli

Elementi:

- Titolo: “I miei veicoli”.  
- Lista dei veicoli ottenuti da `GET /vehicles`.  
- Un indicatore per il veicolo selezionato.  
- Bottone: “Aggiorna elenco veicoli”.  

Alla selezione di un veicolo:

- salvare `vehicle_id_selected`;  
- inviare sincronizzazione credenziali e stato al watch.

## 12.3 Schermata 3 — Stato credenziali

Elementi:

- API Key (parzialmente offuscata, es. con asterischi).  
- Veicolo attivo (vehicle id + nome).  
- Ultimo aggiornamento stato (`last_state_timestamp` formattato).  
- Pulsante: “Re-sincronizza con l’orologio”.  
- Pulsante: “Revoca accesso” (invalida token, cancella preferenze, interrompe sincronizzazione).

---

# 13. COMUNICAZIONE WEAR ↔ PHONE (DATA LAYER)

## 13.1 Sincronizzazione credenziali (PHONE → WATCH)

Path DataLayer: `/tesla/credentials`

Chiavi nel `DataMap`:

- `encrypted_api_key` : String  
- `encrypted_refresh_token` : String  
- `vehicle_id` : String  
- `last_vehicle_state_json` : String (facoltativo)  
- `last_state_timestamp` : Long (facoltativo)

Esempio:

```kotlin
val req = PutDataMapRequest.create("/tesla/credentials").apply {
    dataMap.putString("encrypted_api_key", encryptedApiKey)
    dataMap.putString("encrypted_refresh_token", encryptedRefreshToken)
    dataMap.putString("vehicle_id", vehicleId)
    dataMap.putString("last_vehicle_state_json", lastStateJson ?: "")
    dataMap.putLong("last_state_timestamp", lastStateTs ?: 0L)
}.asPutDataRequest().setUrgent()

Wearable.getDataClient(context).putDataItem(req)
```

## 13.2 Comandi (WATCH → PHONE)

Paths `MessageClient`:

- `/tesla/unlock`  
- `/tesla/climate_toggle`  
- `/tesla/set_charging_amps`

Per `set_charging_amps`, il payload deve contenere un intero (ampere) in formato byte array.

Esempio invio:

```kotlin
val buffer = ByteBuffer.allocate(4).putInt(amps).array()
Wearable.getMessageClient(context)
    .sendMessage(nodeId, "/tesla/set_charging_amps", buffer)
```

---

# 14. FALLBACK RULES (RIEPILOGO)

Regola di decisione sul watch:

```text
if (phoneReachable) {
    // Usa il telefono come proxy
    invia messaggio al telefono (MessageClient)
} else if (watchHasNetwork) {
    // Chiama direttamente le Tesla API
    esegui comando dal watch
} else {
    // Nessuna via di comunicazione
    mostra errore "Nessuna connessione disponibile"
}
```

Il telefono, quando agisce da proxy, deve eseguire:

1. Eventuale wake-up (se stato non recente).  
2. Comando Tesla.  
3. Validazione post-comando.  
4. Aggiornamento stato in cache (`last_vehicle_state_json`, `last_state_timestamp`).  
5. Eventuale sync verso il watch.

---

# 15. STRUTTURA DEI PACKAGE

## 15.1 Companion App (`app/src/main/java/`)

```text
com.teslawearapp
 ├── auth/
 │    ├── OAuthManager.kt          # Gestione flusso OAuth2 + PKCE
 │    ├── TokenStore.kt            # Lettura/scrittura token in EncryptedSharedPrefs
 │
 ├── api/
 │    ├── TeslaApiService.kt       # Interfaccia Retrofit
 │    ├── TeslaApiClient.kt        # Logica di chiamata, refresh token, ecc.
 │
 ├── data/
 │    ├── VehicleRepository.kt     # Gestione lista veicoli, selezione, cache
 │    ├── StateCache.kt            # Gestione last_vehicle_state e timestamp
 │
 ├── wear/
 │    ├── WearSyncManager.kt       # Invia credenziali e stato al watch
 │    ├── WearMessageProxyService.kt # Riceve comandi dal watch e chiama Tesla API
 │
 ├── ui/
 │    ├── ApiKeyActivity.kt        # Schermata inserimento API Key
 │    ├── VehicleListActivity.kt   # Schermata lista veicoli e selezione
 │    ├── StatusActivity.kt        # Schermata stato credenziali
```

## 15.2 Wear App (`wear/src/main/java/`)

```text
com.teslawearapp.wear
 ├── auth/
 │    ├── WearKeyStore.kt          # Gestione chiavi AES su Keystore
 │
 ├── api/
 │    ├── WearTeslaApiService.kt   # Interfaccia Retrofit lato watch
 │    ├── WearTeslaApiClient.kt    # Logica chiamate dirette Tesla dal watch
 │
 ├── data/
 │    ├── WearStateStore.kt        # Gestione last state, credenziali, vehicle_id
 │
 ├── logic/
 │    ├── ConnectivityManager.kt   # Verifica phoneReachable + hasNetwork
 │    ├── WakeUpDecisionEngine.kt  # Logica TTL 5 minuti e wake_up
 │    ├── CommandValidator.kt      # Implementazione validazione post-comando
 │
 ├── ui/
 │    ├── MainActivity.kt          # Schermata principale (Unlock, Climate, Amps)
 │    ├── AmpSelectorActivity.kt   # Schermata slider ampere 1–32A
 │
 ├── services/
 │    ├── WearMessageListener.kt   # Riceve DataItems / Messaggi dal telefono
```

---

# 16. DIAGRAMMA ASCII DEL FLUSSO COMANDI

```text
+------------------+              +------------------+              +------------------------+
|      WATCH       |              |      PHONE       |              |      TESLA API        |
+------------------+              +------------------+              +------------------------+
        |                                  |                                   |
        | 1. Utente preme comando          |                                   |
        |--------------------------------->| (se phoneReachable)               |
        |                                  |                                   |
        |                   2. Wake-up decision (TTL 5m)                       |
        |                                  |                                   |
        |                                  |--> POST /wake_up (se necessario)  |
        |                                  |                                   |
        |                                  |--> POST /command/...              |
        |                                  |                                   |
        |                                  |--> GET /vehicle_data (1.5s, 3s)   |
        |                                  |                                   |
        |                                  |<- stato aggiornato                |
        |<---------------------------------|                                   |
        | 3. UI update                     |                                   |
        |                                  |                                   |
```

Nel caso in cui il telefono non sia raggiungibile ma il watch abbia rete, il flusso è:

```text
WATCH ------------------> TESLA API (diretto)
          (wake_up, command, vehicle_data)
```

---

# 17. COSTI API (MODELLO PREVISTO)

Per le stime indicative (soggette a variazioni Tesla):

- **Wake-Up**: ~0.02 $  
- **Command**: ~0.001–0.002 $  
- **Vehicle Data**: ~0.002 $

Pattern utilizzato:

- Ogni comando:
  - al massimo 1 wake-up (se necessario, in base al TTL di 5 minuti)  
  - 1 o 2 chiamate `GET /vehicle_data` per validazione  

Stima worst-case per 4 comandi al giorno:

- 4 wake-up × 0.02$ = 0.08 $/giorno  
- 8 `vehicle_data` × 0.002$ = 0.016 $/giorno  
- Comandi: trascurabili (0.008 $/giorno)  

Totale: ~0.104 $/giorno → ~3.12 $/mese, ampiamente entro i 10$ di credito gratuito.

---

# 18. TEST LIST (CHECKLIST PER SVILUPPO)

## 18.1 Companion App

- [ ] Inserimento e salvataggio API Key.  
- [ ] Flusso OAuth completato con redirect corretto.  
- [ ] Recupero lista veicoli.  
- [ ] Visualizzazione lista veicoli + selezione.  
- [ ] Salvataggio `vehicle_id_selected`.  
- [ ] Sync credenziali verso il watch.  
- [ ] Schermata stato credenziali con info corrette.  
- [ ] Funzione “Re-sincronizza con l’orologio”.  
- [ ] Funzione “Revoca accesso” (reset completo credenziali e stato).

## 18.2 Watch App

- [ ] Ricezione DataItem `/tesla/credentials` con dati corretti.  
- [ ] Decriptazione API Key e refresh token.  
- [ ] Salvataggio `vehicle_id`, stato e timestamp.  
- [ ] Verifica `phoneReachable`.  
- [ ] Verifica `hasNetwork`.  
- [ ] Modalità proxy funzionante (comando → telefono → Tesla).  
- [ ] Modalità diretta funzionante (comando → Tesla direttamente).  
- [ ] Wake-up decision con TTL 5 minuti correttamente applicata.  
- [ ] Validazione post-comando con 2 tentativi.  
- [ ] UI principale con pulsanti Unlock, Climate Toggle, Charging Amps.  
- [ ] Schermata Ampere con slider 1–32A e comando set amps.  
- [ ] Gestione errori (nessuna rete, token scaduto, ecc.).

---

# 19. TODO PER LO SVILUPPATORE

- Implementare fedelmente la struttura dei package descritta.  
- Configurare Retrofit e Moshi per le Tesla Fleet API.  
- Implementare il flusso OAuth2 + PKCE con AppAuth, usando l’API Key dell’utente.  
- Implementare il `VehicleRepository` per la gestione dei veicoli.  
- Implementare `WearSyncManager` per sincronizzare credenziali e stato al watch.  
- Implementare `WearMessageProxyService` per fungere da proxy dei comandi.  
- Implementare sul watch:
  - gestione Keystore (`WearKeyStore`);  
  - `WearTeslaApiClient` per le chiamate dirette;  
  - `ConnectivityManager` per la modalità intelligente;  
  - `WakeUpDecisionEngine` con TTL 5 minuti;  
  - `CommandValidator` con due tentativi;  
  - UI `MainActivity` e `AmpSelectorActivity`.  

Lo sviluppatore non deve prendere decisioni su architettura o flussi: deve applicare quanto definito in questo documento.

---

# 20. LICENZA / NOTE FINALI

La licenza del progetto (MIT, Apache 2.0, ecc.) e le note di copyright
devono essere definite dal proprietario del repository TeslaWearApp.

Questo documento può essere salvato alla radice del repository come:

```text
DEVELOPER_GUIDE_TESLAWEARAPP.md
```

e rappresenta la guida tecnica di riferimento per l’implementazione
dell’intero progetto TeslaWearApp.
