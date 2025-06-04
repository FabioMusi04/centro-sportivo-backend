# Centro Sportivo - Backend (AdonisJS)

Backend sviluppato in AdonisJS per la gestione informatizzata di un centro sportivo, conforme alla traccia d'esame BSD.

## ✨ Obiettivi del progetto

* Gestione **corsi sportivi**, **istruttori**, **utenti** e **prenotazioni**
* Accesso riservato tramite **autenticazione** (JWT)
* Operazioni **CRUD** per ogni modello
* Endpoint avanzati per interrogazioni complesse
* Integrazione di **Factory**, **Bouncer** e **Comando CLI**

---

## 📊 Struttura del progetto

```
centro-sportivo-backend/
├── app/
│   ├── Controllers/Http/      # Controller REST
│   ├── Models/                # Modelli ORM (Lucid)
│   ├── Middleware/            # Middleware di autenticazione e ruoli
│   └── Services/              # Servizi ausiliari
├── start/                     # Avvio app, rotte e bouncer
├── database/
│   ├── migrations/            # Migrazioni DB
│   └── factories/             # Factory per dati fittizi
├── commands/                  # Comandi CLI personalizzati
├── .env                       # Configurazione ambiente
├── server.ts                  # Entry point
```

---

## 👨‍🏋️ Modelli principali

### `User`

* Campi: `id`, `name`, `email`, `password`, `role` (istruttore o utente o admin)
* Relazioni: ha molti `Course`, ha molte `Booking`

### `Course`

* Campi: `id`, `title`, `description`, `capacity`, `user_id` (istruttore)
* Relazioni: appartiene a `User` (istruttore), ha molte `Booking`

### `Booking`

* Campi: `id`, `user_id`, `course_id`, `booking_date`
* Relazioni: appartiene a `User`, appartiene a `Course`

---

## 🔄 Endpoint CRUD principali

Tutti protetti da middleware di autenticazione `auth`.

* `/users`, `/courses`, `/bookings` → `index`, `store`, `show`, `update`, `destroy`

---

## 📊 Endpoint speciali richiesti

* **Corsi attivi**: `/courses/available`
* **Corsi per istruttore**: `/courses/instructor/:id`
* **Prenotazioni attive**: `/bookings/active`
* **Conteggio prenotazioni per utente**: `/bookings/count-per-user`
* **Top 5 corsi per iscrizioni**: `/courses/top`
* **Utenti senza prenotazioni**: `/users/never-booked`
* **Istruttori con i corsi**: `/users/instructors-with-courses`

---

## 🧳 Autenticazione

* Basata su JWT (`@adonisjs/auth`)
* Solo utenti con ruolo `instructor` possono autenticarsi
* Middleware custom `Role.ts` per protezione ruoli

---

## 🔧 Componenti avanzati

### 🏠 Bouncer

Definisce le policy di autorizzazione per modificare solo le proprie risorse.

### 🌟 Factory

* Generazione dati fittizi per `User`, `Course`, `Booking`

### ⌛ Comando custom

* `CleanOldBookings.ts`: elimina prenotazioni antecedenti a una certa data

---

## 📗 Istruzioni per esecuzione

```bash
# Clona il progetto
$ git clone ...

# Installa le dipendenze
$ npm install

# Crea file .env
$ cp .env.example .env

# Configura variabili ambiente e database

# Esegui migrazioni
$ node ace migration:run

# Popola con dati fittizi
$ node ace db:seed

# Avvia il server
$ node ace serve --watch
```

---

## 📖 Scelte progettuali

* **AdonisJS** per struttura MVC chiara e strumenti integrati (migrazioni, auth, CLI)
* **Bouncer** per una gestione fine delle autorizzazioni
* **Command e Factory** per manutenibilità e testing
* **Separazione ruoli** con middleware

---

## 📄 Autore

**\[Fabio Musitelli]**

Progetto sviluppato per l'esame BSD (Backend Sviluppo Digitale) - JOBS Academy
