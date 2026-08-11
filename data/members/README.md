# Sådan tilføjer du din portefølje

Nemmeste måde: gå til **Aktie-oversigt** på hjemmesiden, klik på dit navn,
og redigér direkte i formularen der åbner (se afsnittet "Redigér din
portefølje via hjemmesiden" i hoved-READMEen). Det opretter/opdaterer denne
fil for dig automatisk.

Vil du hellere redigere filen direkte:

1. Kopiér en af de eksisterende `.json`-filer i denne mappe og navngiv den efter dig selv, fx `mette.json`.
2. Ret indholdet til dine egne beholdninger:

```json
{
  "id": "mette",
  "name": "Mette",
  "holdings": [
    {
      "symbol": "AAPL",
      "shares": 10,
      "boughtDate": "2024-03-01",
      "boughtPrice": 178.5,
      "soldDate": null,
      "soldPrice": null
    }
  ]
}
```

3. `id` skal være unikt (og gerne uden mellemrum/æøå) — brug det som filnavn.
4. `symbol` skal være i Yahoo Finance-format:
   - Amerikanske aktier: bare tickeren, fx `AAPL`, `MSFT`, `TSLA`.
   - Danske aktier: ticker + `.CO`, fx `NOVO-B.CO`, `MAERSK-B.CO`, `DANSKE.CO`, `ORSTED.CO`.
   - Andre lande: se tickeren på [finance.yahoo.com](https://finance.yahoo.com) (samme format som i søgefeltet der).
5. Hver post i `holdings` er ét køb ("en lot"). Købte du den samme aktie
   ad to omgange, så lav to poster.
   - `boughtDate` / `boughtPrice`: hvornår og til hvad du købte — bruges
     til at vise dit afkast, men ikke til selve kursberegningen (den bruger
     altid den aktuelle markedskurs).
   - `soldDate` / `soldPrice`: sæt dem hvis/når du sælger. Sætter du en
     `soldDate`, stopper den post med at tælle med i din portefølje-værdi
     fra den dato. **Vi tracker ikke en kontantbeholdning** — solgte aktier
     forsvinder simpelthen fra opgørelsen, de bliver ikke til "kontanter".
   - Ikke solgt endnu? Sæt begge til `null`.
6. Slet `eksempel-*.json`-filerne, når rigtige medlemmer er kommet ind.
7. Lav en pull request (eller push direkte, hvis du har adgang) — GitHub Action'en genberegner automatisk performance-tallene og opdaterer "Aktie-oversigt"-siden.

Du behøver ikke røre noget andet i koden for at opdatere din portefølje — bare denne ene fil.
