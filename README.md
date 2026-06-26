# Beat the Clown

Beat the Clown is a dark-comedy 2D physics contraption game prototype built with vanilla HTML, CSS, and JavaScript.

The current prototype focuses on:

- A giant-head cartoon clown character with no torso
- Layered damage, bones, organs, gore, regeneration, and sandbox modifiers
- Audience reactions, scoring, combo feedback, and requests
- A first regular performance loop where items drop from a pipe, must be wired manually, and activate through trigger/action chains
- A sandbox mode with character spawning, editing, item tools, and runtime mods

## Running Locally

Install dependencies is not required because the project has no external packages.

```sh
npm start
```

Then open:

```txt
http://127.0.0.1:8765
```

You can also open `index.html` directly in a browser for quick static testing.

## Project Structure

- `index.html` - root game page for deployment
- `clown-prototype.html` - alternate direct prototype page
- `clown-prototype.css` - game UI and canvas styling
- `clown-prototype.js` - gameplay, character, physics, sandbox, performance, scoring, and rendering systems
- `server.cjs` - tiny local static server
- `CLOWN_PROTOTYPE.md` - implementation notes and system documentation
- `package.json` - project scripts and metadata

## Scripts

```sh
npm start
npm run dev
npm run check
```

`npm run check` runs a JavaScript syntax check on the main game file.

## Deployment

This is currently a static vanilla JavaScript project. It can be deployed from the repository root on GitHub Pages or any static host. The root URL serves `index.html`, which loads the game directly.

## Source Of Truth

The GitHub repository for this project is:

```txt
https://github.com/2ndsebastiantablet-hash/beat-the-clown
```

All future Beat the Clown changes should be committed and pushed to that repository.
