# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/SEMIT-SUAS/sicaf-frontend/compare/v1.2.1...v1.3.0) (2026-06-09)


### Features

* add remove signature button to guard form ([7840475](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/78404750693fa63a484c24c348293c496fa52ec7))

### [1.2.1](https://github.com/SEMIT-SUAS/sicaf-frontend/compare/v1.2.0...v1.2.1) (2026-06-09)

## [1.2.0](https://github.com/SEMIT-SUAS/sicaf-frontend/compare/v1.1.0...v1.2.0) (2026-06-09)


### Features

* enhance signature modal with canvas and upload options ([10da159](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/10da15964353c82d59b5320fbec7304750d5e0d4))

## 1.1.0 (2026-06-02)


### Features

* add audit logging module ([5e6493a](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/5e6493a28580ae36577ac5e17d0e792fc31d1b20))
* add audit navigation to sidebar ([05d11d3](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/05d11d322cca511e9e3e6ada219c74a8f33501a8))
* add certificates and equipment management ([d518453](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/d518453d8e7349238f4addf7c244786d42c2419e))
* add print batch page and signature functionality ([650c47d](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/650c47dd025e8cf0d3ec8ad48a7f6c4c5dc7ec1c))
* add weapon carry status field to guards ([01fbd6c](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/01fbd6cd36ddedbe9dde52adafb54c6834cda3ec))
* **admin:** migrate dashboard mock data to real API integration ([49b4bbb](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/49b4bbbb994ba1fe7752bd39e6f6e3fe7a3ba032))
* **admin:** replace browser confirm with AlertDialog and fix icon imports ([380b444](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/380b444049ab6f63d89ab91ba17b94f9e5acd6d5))
* **api:** configure axios instance with auth interceptors and dynamic base URL ([cc7ceca](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/cc7ceca20457205408a81fbce88ef93dd97342d6))
* **audit:** enhance audit log handling with new entity and action labels ([3ab5893](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/3ab58932c8ce08ab5102a28e028bd53ea27f1818))
* **dashboard:** migrate admin routes to dashboard and implement help page ([2b7a9ba](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/2b7a9ba60586057b3fd9b84e39405c5def1d663b))
* **forms:** implement photo resizing, drag-and-drop and draft cache ([cf5f5c6](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/cf5f5c640b0f92e0f5e2b09d184c1f279d3f9179))
* **frontend:** implement getOrigin utility for consistent URL handling in AuthenticatedImage and document-utils ([045bbd9](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/045bbd9f18d353b1b8de3f9969a9f349ae572574))
* **frontend:** implement password requirement for guard deletion ([78a6cd0](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/78a6cd08760ec5c2c53d7eb3c11e2dd7e51a1d37))
* **frontend:** restrict uploads to PDF, truncate filenames, and update signed URL parameter to 'sig' ([554444a](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/554444a43749b4d0dafe615745acce0693d155c8))
* implement data masking for public validation ([1334556](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/1334556b0d25d78e0b6f126ff34e35ff92497e25))
* integrate public data masking in validation pages ([a2fd214](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/a2fd214d1aad276cd330341dccb7ebc578994bbc))
* **mobile:** implement bottom navigation and responsive admin layout ([96a3f3c](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/96a3f3cee922203f85e4c04fbaab471af075eeba))
* **nav:** update sidebar and mobile navigation for role-based access ([29a137f](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/29a137ffa4a5355919d06631ef064242c13f83ef))
* **qa:** implement automated form testing, strict field validation and auto-print logic ([01adc59](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/01adc590d023b389b7c8ca6e206f90abd726847a))
* **refactor:** remove mock data and update types for API integration ([ecbfaad](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/ecbfaada42c82c2dc746245450b860163ceb7fdb))
* **services:** implement guards and auth services for backend communication ([a99d078](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/a99d07803893a11b9a606da31822a73f56a2142e))
* **ui:** implement multi-level layout and pastel theme for toasts ([938b31c](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/938b31cdf6f4efd99a90da1cc4f1dc7a3adaaf9c))
* update system naming ([e8f6cec](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/e8f6cec54ada3b93f3493083ef638e1df7eedde2))


### Bug Fixes

* adjust prod runtime API/analytics and update node base image ([6d7bb01](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/6d7bb0183af6bb08fcf034d3217c5fa377f4e882))
* **auth:** prevent layout shifts during security error messages ([7865ef3](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/7865ef377a7e1e48a7b42fc4238e19dd610a3b68))
* **build:** change npm ci to npm install ([8b611fb](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/8b611fb2ca0f4898a34d8d50d9b873ad0b6eaddb))
* **design:** resolve image warnings and refine header layout ([44715d9](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/44715d902f9c144c39a427a95e5e83ee981e6942))
* **design:** resolve next/image aspect ratio warnings and encoding ([18117b8](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/18117b85157706e57132c858b365f6f56030ed3b))
* **frontend:** implement horizontal responsiveness and fix table layout syntax ([40f68f4](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/40f68f4d20285b418da00372d848a93df2969fbb))
* **frontend:** refine dashboard layouts and update typescript definitions ([debf5a7](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/debf5a7b51846d353b8e9772ab321d770ace28df))
* **frontend:** update card layout, allowed origins, and general UI refinements ([abab537](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/abab537a4131b3bd9c19e3be00d257650aeba940))
* improve PDF generation feedback and loading indicators ([6dd616d](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/6dd616da3c5c33dbb7cb6aaca8c5bc9a5091dc70))
* remove unnecessary scrollbar ([104e91a](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/104e91a30c4cf9d105695454a7ed12fd9f8b3408))
* resolve TypeScript type error in ValidatePage ([37bb987](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/37bb9873f04dc1362ad9913975a3a033b5ad6172))
* **types:** resolve implicit any and sync Guard structure with backend ([3a2bd6f](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/3a2bd6f810a951e9b40f705cb962f08dcc2cf4cd))
* **ui:** improve functional card rendering and expiration indicators ([90447bf](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/90447bfbd59ab93382875df9a5820193d1390567))
* update validation URL to use official sicaf domain ([26e1dc8](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/26e1dc83a3ef96dee94ca849ea228840c6c08322))
* **users:** implement password confirmation and dirty state check ([0aa4654](https://github.com/SEMIT-SUAS/sicaf-frontend/commit/0aa4654b658aa0ad5eb9c5a35dce8667911e4dea))
