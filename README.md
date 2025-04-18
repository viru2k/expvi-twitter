# Expvi Twitter Frontend

A Twitter-like social platform frontend built with Angular (standalone), leveraging Component Store for reactive state management, PrimeNG for UI components, and multi-language support with ngx-translate.

---

## 🚀 Technologies Used

- ✅ **Angular 17** (standalone configuration)
- ✅ **@ngrx/component-store** for local reactive state management
- ✅ **Redux DevTools** for state inspection and debugging
- ✅ **PrimeNG** as the UI component library
- ✅ **SCSS** for styling
- ✅ **@ngx-translate/core** for multi-language support (`en-GB` default)
- ✅ **Git Flow** as a branching strategy (`main`, `feature/`, `release/`, etc.)

---

## 🛠️ Installation

Install dependencies using:

```bash
npm install --legacy-peer-deps


 Auto-generate API Client

The API services are automatically generated using the OpenAPI specification.
To regenerate the services (in case the backend changes):

openapi-generator-cli generate -i data-2025413223217.json -g typescript-angular -o apps/expvi-twitter/src/app/api

 Redux DevTools Integration

 You can inspect the store and track state changes using:

🔗 Redux DevTools Chrome Extension

This project uses ComponentStore to handle state in a reactive and modular way.


Translations

The project uses @ngx-translate/core for internationalization (i18n).

    Default language: en-GB

    Translation files are located at:

apps/expvi-twitter/src/assets/i18n/en-GB.json
