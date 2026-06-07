# Next.js Coding Rules Index

Each rule is isolated in one file to avoid duplication.
Load only the rule files required by the files you modify.

## Rule files

- `01-app-layout-tsx.md`
- `02-app-root-page-tsx.md`
- `03-app-private-page-tsx.md`
- `04-app-private-loading-tsx.md`
- `05-app-private-error-tsx.md`
- `06-app-public-page-tsx.md`
- `07-containers-folder.md`
- `08-container-index-tsx.md`
- `09-container-controller-ts.md`
- `10-container-types-folder.md`
- `11-container-components-folder.md`
- `12-components-folder.md`
- `13-utils-folder.md`
- `14-constants-folder.md`
- `15-services-api-client-ts.md`
- `16-services-service-file.md`
- `17-tests-e2e-folder.md`
- `18-styles-folder.md`
- `19-config-env-ts.md`
- `20-types-folder.md`
- `21-services-mock-file.md`

## Path -> rule -> template map

| Target path | Rule file | Template file |
|---|---|---|
| `<source-root>/app/layout.tsx` | `01-app-layout-tsx.md` | `../templates/app/layout.tsx.template` |
| `<source-root>/app/providers.tsx` | `01-app-layout-tsx.md` | `../templates/app/providers.tsx.template` |
| `<source-root>/app/page.tsx` | `02-app-root-page-tsx.md` | `../templates/app/page.tsx.template` |
| `<source-root>/app/(private)/<url-path-name>/page.tsx` | `03-app-private-page-tsx.md` | `../templates/app/private/page.tsx.template` |
| `<source-root>/app/(private)/<url-path-name>/loading.tsx` | `04-app-private-loading-tsx.md` | `../templates/app/private/loading.tsx.template` |
| `<source-root>/app/(private)/<url-path-name>/error.tsx` | `05-app-private-error-tsx.md` | `../templates/app/private/error.tsx.template` |
| `<source-root>/app/(public)/<url-path-name>/page.tsx` | `06-app-public-page-tsx.md` | `../templates/app/public/page.tsx.template` |
| `<source-root>/containers/<url-path-name-container>/` | `07-containers-folder.md` | n/a |
| `<source-root>/containers/<url-path-name-container>/index.tsx` | `08-container-index-tsx.md` | `../templates/containers/index.tsx.template` |
| `<source-root>/containers/<url-path-name-container>/controller.ts` | `09-container-controller-ts.md` | `../templates/containers/controller.ts.template` |
| `<source-root>/containers/<url-path-name-container>/actions.ts` | `09-container-controller-ts.md` | `../templates/containers/actions.ts.template` |
| `<source-root>/containers/<url-path-name-container>/types/` | `10-container-types-folder.md` | `../templates/containers/types/example.types.ts.template` |
| `<source-root>/containers/<url-path-name-container>/types/index.ts` | `10-container-types-folder.md` | `../templates/containers/types/index.ts.template` |
| `<source-root>/containers/<url-path-name-container>/components/` | `11-container-components-folder.md` | n/a (use `react-component-generator` — see Rule 11) |
| `<source-root>/components/<component-name>/` | `12-components-folder.md` | n/a |
| `<source-root>/utils/` | `13-utils-folder.md` | `../templates/utils/format.ts.template` |
| `<source-root>/constants/` | `14-constants-folder.md` | `../templates/constants/index.ts.template` |
| `<source-root>/services/api-client.ts` | `15-services-api-client-ts.md` | `../templates/services/api-client.ts.template` |
| `<source-root>/services/<service-name>.service.ts` | `16-services-service-file.md` | `../templates/services/service.ts.template` |
| `<source-root>/tests/e2e/` | `17-tests-e2e-folder.md` | `../templates/tests/e2e/route-flow.spec.ts.template` |
| `<source-root>/styles/` | `18-styles-folder.md` | `../templates/styles/globals.css.template` |
| `<source-root>/config/env.ts` | `19-config-env-ts.md` | `../templates/config/env.ts.template` |
| `<source-root>/types/` | `20-types-folder.md` | `../templates/types/global.ts.template` |
| `<source-root>/services/mockApi/<service-name>.mock.ts` | `21-services-mock-file.md` | `../templates/services/mockApi/service.mock.ts.template` |
