+++
date = ""
draft = true
featureImage = ""
postImage = ""
title = "Hugo site with membership "

+++
Ultimamente mi sto interessando alla creazione di siti con Hugo.

Questo mio sito ne è un esempio, ma il mio obiettivo è il rifacimento del sito di mia moglie computersenzapensieri.com.

Il suo sito è attualmente realizzato in WordPress e hostato su Aruba.it; presenta indubbiamente 2 problemi, anche considerando che ad oggi non è ancora diventato una fonte di reddito (cosa che ci auguriamo divenga presto):

* Il primo problema è legato alle performance: a mio parere WordPress è una piattaforma che necessita di troppe risorse. E se parliamo di piccoli siti con poche visite giornaliere, è assurdo pensare di dover spendere un centinaio di euro all'anno tra hosting e SQL per evitare che il caricamento di una pagina impieghi diversi secondi.
* Il secondo problema è legato appunto al costo dell'hosting. Per un sito a livello hobbistico come è attualmente sia il mio che quello di mia moglie, ci si aspetta che non occupi praticamente risorse e quindi possa essere facilmente hostato da servizi per lo più gratuiti. Badiamo bene che come sviluppatore sono per lo più contrario al concetto che il software ed internet debbano essere per lo più gratuiti (il pane a casa lo dobbiamo portare tutti,) però dobbiamo fare in modo di consumare una quantità di risorse adeguate rispetto al tipo di progetto e quindi per piccoli siti con poche visite giornaliere è inutile dover mettere in campo potenze di calcolo enormi.

Sono quindi incappato nei motori di siti statici tra cui Hugo.

Dapprima ho creato questo sito semplicemente utilizzando uno dei temi disponibili direttamente dal sito Hugo, e da poco mi sto occupando del rifacimento di computersenzapensieri.com.

Per questo sito ho deciso di acquistare un template HTML (non sono un grafico e quindi un po' di aiuto da qualcuno più esperto lo pago volentieri) e poi lo ho riadattato in modo che diventasse un template Hugo.

Ultimo step è la volontà di introdurre all'interno del sito un concetto di membership per iniziare a creare una community intorno ai contenuti realizzati da mia moglie e perché no anche di valorizzare i suoi sforzi chiedendo una piccola fee mensile a coloro che vogliono più aiuto personale da parte sua.

Con WordPress sicuramente tutto questo sarebbe stato più semplice ma piacendomi le sfide a livello di programmazione, sto cercando con piacere il modo per raggiungere lo stesso risultato utilizzando Hugo.

Mi sono quindi imbattuto in questo interessante articolo https://www.netlify.com/blog/2020/07/13/manage-subscriptions-and-protect-content-with-stripe/ di Jason Lengstorf in cui viene realizzato un sito con membership utilizzando Netlify identity e Shopify.

Ho quindi iniziato la sua implementazione in Hugo e vi terrò aggiornati sullo stato di avanzamento nei prossimi post.