# DAILO App

Frontend aplikacji **DAILO** – panelu administracyjnego z logowaniem, kontem użytkownika oraz
zarządzaniem użytkownikami, rolami i uprawnieniami. Aplikacja współpracuje z API (Laravel)
i jest dostępna w trzech językach: polskim, angielskim i hiszpańskim.

## Spis treści

- [Stack technologiczny](#stack-technologiczny)
- [Funkcjonalności](#funkcjonalności)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja](#konfiguracja)
- [Polecenia](#polecenia)
- [TODO](#todo)

## Stack technologiczny

| Obszar      | Technologie                                                         |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Angular 22 (standalone components), TypeScript 6, RxJS 7            |
| Formularze  | Angular Reactive Forms                                              |
| UI          | ZardUI (lokalne komponenty), Tailwind CSS 4, Angular CDK / Material |
| Ikony       | Font Awesome, `@ng-icons/lucide`                                    |
| Kontrolki   | `@ng-select/ng-select`, `ngx-ui-switch`                             |
| Komunikaty  | `ngx-sonner` (toasty), SweetAlert2 (potwierdzenia)                  |
| i18n        | `@ngx-translate/core` (PL / EN / ES)                                |
| Uprawnienia | `ngx-permissions`                                                   |
| Testy       | Vitest (unit), Cypress (e2e)                                        |
| Jakość      | ESLint (`angular-eslint`, `typescript-eslint`), Prettier            |

## Funkcjonalności

### 🔐 Uwierzytelnianie

- Logowanie z opcją „Zapamiętaj mnie”.
- Rejestracja nowego konta (włączana flagą `ENABLE_REGISTRATION`) z akceptacją regulaminu.
- Potwierdzenie konta linkiem aktywacyjnym (`/confirm-account/:code`).
- Reset hasła: wysłanie maila (`/password-reset`) i ustawienie nowego hasła
  (`/password-reset-finish/:code`).
- Walidacja formularzy po stronie klienta i wyświetlanie błędów zwróconych przez API.
- Obsługa wygaśnięcia sesji (401) z automatycznym wylogowaniem oraz komunikat o braku połączenia
  z API.

### 👤 Konto użytkownika

- **Dane** – edycja danych podstawowych, dodawanie i usuwanie awatara (z podglądem), ponowne
  wysłanie maila aktywacyjnego, usunięcie konta.
- **Hasło** – zmiana hasła z potwierdzeniem i podglądem wpisywanego tekstu.
- **Ustawienia** – osobiste ustawienia użytkownika przechowywane w API.

### 🛠️ Administracja

Dostęp do widoków jest kontrolowany uprawnieniami (`USERS_*`, `ROLES_*`).

- **Użytkownicy** – lista z sortowaniem, filtrowaniem i paginacją, podgląd, dodawanie, edycja,
  usuwanie, lista usuniętych kont z możliwością przywrócenia, przypisywanie ról oraz historia zmian.
- **Role** – lista, podgląd, dodawanie i edycja ról z pogrupowanymi uprawnieniami, usuwanie
  oraz historia zmian.
- Tabele pozwalają ukrywać kolumny i zapamiętywać swój stan (filtry, sortowanie, paginacja)
  w `localStorage`.

### 🎨 Interfejs

- Layout panelu: zwijany sidebar z menu zależnym od uprawnień, breadcrumb, przełącznik języka,
  menu użytkownika i powiadomienia.
- Jasny i ciemny motyw.
- Responsywny układ (desktop i urządzenia mobilne).
- Okna dialogowe (`AppDialogService`), toasty (`ToastService`) i potwierdzenia SweetAlert2.
- Strona 404 dla nieistniejących adresów.

## Struktura projektu

```text
src/
├── app/
│   ├── core/          # guardy, interceptory HTTP, logger
│   ├── features/      # moduły funkcjonalne: auth, account, administration, dashboard, error
│   ├── layout/        # layouty: publiczny, panelu (dashboard) i błędów
│   ├── shared/        # komponenty bazowe, UI aplikacji, serwisy, interfejsy, helpery
│   └── zardui/        # lokalnie skopiowane komponenty ZardUI (import przez @/zardui/...)
├── assets/i18n/       # tłumaczenia: pl, en, es
├── environments/      # konfiguracja środowisk
└── styles/            # Tailwind, design tokens (styles.css) i style własne (custom.scss)
```

Nowe komponenty ZardUI dodaje się poleceniem:

```bash
npx zard-cli@latest add <nazwa>
```

Pliki trafiają do `src/app/zardui/`. Wytyczne dotyczące pracy nad UI i formularzami są
w [AGENTS.md](AGENTS.md).

## Konfiguracja

Ustawienia środowisk znajdują się w `src/environments/`
(`environment.ts`, `environment.dev.ts`, `environment.prod.ts`). Najważniejsze z nich:

| Klucz                              | Opis                                               |
| ---------------------------------- | -------------------------------------------------- |
| `SERVER_URL`                       | Adres API (domyślnie `http://localhost:8000/api/`) |
| `SERVER_PUBLIC_PATH`               | Publiczny adres serwera                            |
| `ENABLE_REGISTRATION`              | Włącza rejestrację nowych kont                     |
| `ENABLE_LANGUAGE_CHANGE`           | Włącza przełącznik języka                          |
| `DEFAULT_LANGUAGE`                 | Język domyślny (PL)                                |
| `LANGUAGES_AVAILABLE`              | Dostępne języki                                    |
| `PAGE_SIZES` / `DEFAULT_PAGE_SIZE` | Rozmiary stron w tabelach                          |

## Polecenia

Przed pierwszym uruchomieniem zainstaluj zależności:

```bash
npm install
```

### 🚀 Uruchamianie

| Polecenie       | Opis                                                      |
| --------------- | --------------------------------------------------------- |
| `npm start`     | Serwer deweloperski – aplikacja pod http://localhost:4200 |
| `npm run watch` | Ciągła kompilacja w konfiguracji development              |

### 🏗️ Build

| Polecenie           | Opis                                            |
| ------------------- | ----------------------------------------------- |
| `npm run build`     | Build produkcyjny + `post-build`         |
| `npm run build-dev` | Build w konfiguracji development + `post-build` |
| `npm run build-all` | Oba warianty po kolei                           |

Skrypt `build/post-build.js` podmienia w plikach z `dist/` znacznik `{{APP_VERSION_TO_REPLACE}}`
na znacznik czasu builda. Dzięki temu przeglądarka po wdrożeniu pobiera nowe pliki tłumaczeń
zamiast wersji z cache.

### 🧪 Testy

| Polecenie              | Opis                                  |
| ---------------------- | ------------------------------------- |
| `npm run test`         | Testy jednostkowe (Vitest)            |
| `npm run e2e`          | Testy e2e (Cypress przez Angular CLI) |
| `npm run cypress:open` | Cypress w trybie interaktywnym (GUI)  |
| `npm run cypress:run`  | Cypress w trybie headless (np. CI)    |

### 🧹 Linter

| Polecenie      | Opis                                                         |
| -------------- | ------------------------------------------------------------ |
| `npm run lint` | ESLint dla `.ts` i `.html` (z pominięciem `src/app/zardui/`) |

## TODO

- Dodać automatyczne przeładowywanie uprawnień co X czasu.
