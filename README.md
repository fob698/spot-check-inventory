# Spot Check

A private notebook for the Tenth and Eleventh Step practices described in *Alcoholics Anonymous* (pp. 64–67 and 84–88). Five tabs, no account, no server, works offline.

**Live:** https://fob698.github.io/spot-check-inventory/

## What it is

Five tabs, each a single form you can fill in any order with nothing required:

| Tab | Practice | Pages |
|-----|----------|-------|
| Nightly | The end-of-day review | p. 86 |
| Spot Check | Watching for selfishness, dishonesty, resentment and fear, and the pause when agitated | pp. 84–85, 87–88 |
| Morning | Plans for the day and the asks | pp. 86–87 |
| Resentment | The four-column inventory | pp. 64–67 |
| History | Everything you have saved, searchable | — |

Every long-form box starts collapsed, so the page is a list of questions rather than a wall of empty text areas. The app opens on whichever tab you used last.

## Privacy

There is no server. Entries are written to browser storage on the device you are using and never leave it. No account, no login, no sync, no analytics, and no network request of any kind once the page has loaded.

That also means there is no backup. Clearing browser data erases everything, and on iPhone, Safari clears storage for sites you have not opened in about a week — adding the app to your home screen exempts it from that. The in-app About page says all of this.

## Running it locally

No build step, no dependencies. Serve the folder over HTTP (a service worker will not register from `file://`):

```
python3 -m http.server 8731
```

Then open `http://localhost:8731/`.

## Deploying

GitHub Pages serves this repo from the root of `main`. A push deploys it.

> **Do not rename this repository.** Browser storage is scoped to the origin, which includes the `/spot-check-inventory/` path. Renaming the repo changes that origin, and every entry saved on every installed device becomes unreachable. The same applies to moving the app to a different domain.

To bump the offline cache after changing `index.html`, increment `VERSION` in `sw.js`.

## Spec

`ISA.md` is the working spec: what this is for, what it deliberately does not do, and the criteria it has to meet.

## Not an official AA product

Not affiliated with, endorsed by, or approved by Alcoholics Anonymous World Services, Inc. Short question phrases are quoted with page citations; the book is not reproduced here.
