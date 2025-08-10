# Components Directory

Questa cartella contiene tutti i componenti React riutilizzabili dell'applicazione, suddivisi per tipologia:

- **layout/**: componenti che gestiscono la struttura generale delle pagine (es. Header, Footer, SectionTitle).
- **ui/**: componenti di interfaccia utente generici e riutilizzabili (es. Button).
- **feature/**: componenti specifici di una funzionalità o sezione (es. RecipeCard, HeroSection, DisableDraftMode).

## Come aggiungere un nuovo componente
1. Scegli la sottocartella più adatta in base alla funzione del componente.
2. Se il componente è molto complesso, crea una sottocartella con lo stesso nome e inserisci lì file, stili e test.
3. Esporta il componente tramite un `index.ts` se necessario.

## Convenzioni
- Usa nomi chiari e descrittivi per i file e le cartelle.
- Mantieni i componenti piccoli e riutilizzabili quando possibile.
- Aggiungi commenti utili nei componenti complessi.

---

_Questo README aiuta a mantenere ordine e coerenza nella gestione dei componenti._ 