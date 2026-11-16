# DAILO app – guidelines for UI work

## Project snapshot

- Angular 22 standalone application using TypeScript 6, RxJS 7 and Angular Reactive Forms.
- Styling is Tailwind CSS 4. The active design tokens and dark-mode variables live in `src/styles/styles.css`; global Tailwind styling is in `src/styles/tailwind.css`.
- UI components are locally copied ZardUI components. PrimeNG has been fully removed (dependencies, providers and global styles); do not reintroduce it.
- All ZardUI code lives in `src/app/zardui/` and is imported through the `@/zardui/...` alias (for example `@/zardui/components/input`). `provideZard()` is already registered in `src/app/app.config.ts`.
  - `src/app/zardui/components/` – Zard UI components (button, input, dropdown, sidebar, breadcrumb, …).
  - `src/app/zardui/core/` – Zard core: directives, overlay, `provideZard()`, i18n, `css/zard.css` (imported from `src/styles/styles.css`).
  - `src/app/zardui/utils/` – Zard helpers (`mergeClasses`, `noop`, `number`).
  - `src/app/zardui/blocks/` – Zard blocks (for example `sidebar-07`).
  - `src/app/zardui/services/` – target for Zard services added by the CLI (for example dark mode).
- `src/app/shared/` holds only application code (base components, `form-control-errors`, `mat-table`, `ui/*`, app services and utils). Do not put Zard code there and do not import Zard code through `@/shared/...`.
- New Zard components are added with the Zard CLI (`npx zard-cli@latest add <name>`). `components.json` maps every alias (`components`, `utils`, `core`, `services`, `blocks`) to `@/zardui/...` with `baseUrl: "src/app"`, so the CLI writes files into `src/app/zardui/` and rewrites their imports to `@/zardui/...`. Keep `components.json` aliases and the `@/*` path in `tsconfig.json` in sync with this layout.
- The app has translation namespaces in `src/assets/i18n/{en,es,pl}` and uses `@ngx-translate/core`. Keep UI copy translatable; do not hard-code new user-facing strings.

## Package and UI inventory

- Keep the existing stack: Angular CDK/Material, Font Awesome, `@ng-icons/lucide`, `@ng-select/ng-select`, SweetAlert2, Chart.js, Tailwind, `class-variance-authority`, `clsx`, `tailwind-merge`, and `ngx-sonner` (used by the Zard sonner component).
- Toasts: inject `ToastService` (`src/app/shared/services/translated-toast/`) and call `show(type, translationKey, life?, params?)`. It renders through `<z-sonner>` in `src/app/app.html`.
- Modals: use `AppDialogService` from `src/app/shared/components/ui/dialog/`. Content components inject `DialogRef` and `DIALOG_DATA` from `@angular/cdk/dialog`.

## ZardUI conventions

- Reuse the local components in `src/app/zardui/` before creating a new wrapper or adding a UI library. Existing building blocks include `ZardInputComponent`, `ZardInputGroupComponent`, `ZardButtonComponent`, `ZardCheckboxComponent`, `ZardSelectComponent`, and `ZardAlertComponent`.
- Use the APIs implemented in this repository, not assumed APIs from another ZardUI version. Inspect the component source and its `*.variants.ts` file before using a component or a variant.
- Prefer the established syntax:
  - `<input z-input ... />` for native inputs bound to forms.
  - `<button z-button zSize="lg" [zLoading]="..." [zDisabled]="...">` for actions.
  - `<z-checkbox formControlName="..." zId="..." />` for boolean controls.
  - `<z-alert zType="destructive">...</z-alert>` for in-page destructive errors.
- Use Tailwind utilities for layout and page-level presentation. Do not add theme-only workarounds; use the design tokens from `src/styles/styles.css` (`bg-primary`, `text-muted-foreground`, `border-border`, ...).
- Import only what a standalone component template needs.

## Forms: required pattern

Reference forms (see also `features/administration/*/update-*` and `features/account/components/*`):

- `src/app/features/auth/login/`
- `src/app/features/auth/register/`
- `src/app/features/auth/password-reset/`
- `src/app/features/auth/password-reset-finish/`

When building or changing a form:

1. Preserve the existing `FormGroup`, validators, payload shape, service calls, navigation, loading state, toast behavior, and server-error handling. A UI change must not change business behavior.
2. Keep Reactive Forms with `formGroup`, `formControlName`, `novalidate`, and Angular control-flow syntax (`@if`) used by this codebase.
3. Keep labels connected to controls via matching `for` and `id`; every interactive control needs a stable ID. Maintain `name`, useful `autocomplete`, and appropriate native `type` attributes.
4. Keep `[attr.aria-invalid]` driven by `isFormControlInvalid(...)`. Use `zInvalid` as well for Zard controls that expose it.
5. Display validation through `app-form-control-errors`, passing both the Angular control errors and `getServerErrors(fieldName)`. Clear per-field server errors on user input as the current forms do.
6. Mark every control as touched when submission is invalid, and prevent duplicate submissions with `[zDisabled]="form.invalid || isLoading()"` plus `[zLoading]="isLoading()"`.
7. For password fields, preserve show/hide behavior and use a `type="button"` toggle. Use independent visibility signals for password and confirmation fields.
8. For cross-field validation, retain the existing `passwordMatchValidator()` behavior and the `mismatch` error handled by `FormControlErrorsComponent`.

## UI change workflow

1. Inspect the full template, component imports, local SCSS, tests, and the Zard component source in `src/app/zardui/`.
2. Change only the control(s) in scope. Preserve DOM semantics, keyboard behavior, form bindings, i18n keys, and responsive layout.
3. Run formatting and the relevant checks after each coherent change:

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

   For small, low-risk changes (a single class or style tweak, markup-only adjustments, copy,
   docs) skip `npm run test` and `npm run build`: make the change, explain it briefly, and let
   the user verify it in the browser. Keep investigation proportional to the change; do not
   spend long analysis or heavy checks on a trivial fix.

4. Manually verify light and dark themes, disabled/loading state, client validation, server validation, keyboard navigation, and mobile layout.

## Guardrails

- Do not modify generated output, `node_modules`, lockfiles, backend-facing interfaces, or translations unless the task explicitly requires it.
- Do not mix UI changes with unrelated refactors.
- Keep changes focused, preserve the current file organization, and follow the repository Prettier configuration (100-column width, single quotes, Angular HTML parser).
