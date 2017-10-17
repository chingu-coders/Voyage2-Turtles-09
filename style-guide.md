# Style Guide
## Turtles-Team-9
### Version 1.0.0

_A non-exhaustive style guide for a Chrome extension._
Borrowed in part from: https://developers.lewiscommunications.com/standards

## General
- 2 spaces/1 tab
- No padding around parentheses;
  e.g., incorrect: `$( "#main-wrapper" )` _correct_: `rgba(0, 0, 0, .5)`
- Double quotes ("") for everything except a quotation in a string
- Do not abbreviate unless intuitive/conventional; err on the side of caution
## Comments
- Keep each line of a comment to less than 80 characters
- JavaScript: use `//` for each line of a comment not `/* ... */`

## HTML
- Include `<script src="js/...">` tags before closing `</body>` tag
- Lower case & hyphenate `class-names`
- camelCase `id` names; e.g., `userNameEntryLine`
- Do not use `id` as a "style hook", i.e., provide a `class` if specific CSS is
  to be applied to that element

## CSS
- One empty line between selector declarations
- Multiple selectors on their own lines; e.g.,:
  ```
    .body,
    .initial-wrapper,
    .main-wrapper {
      margin: 0;
    }
  ```
- Organize selectors in the following sections:

  1. General layout
  2. Following this grid:
  -------------------------
  |       |       |       |
  |   1   |   2   |   3   | Top row
  |       |       |       |
  -------------------------
  |       |       |       |
  |   4   |   5   |   6   | Middle row
  |       |       |       |
  ------------------------
  |       |       |       |
  |   7   |   8   |   9   | Bottom row
  |       |       |       |
  -------------------------

  3. Utilities

- Alphabetize selectors within a section
- Alphabetize pseudo-selectors under their selector
- *Alphabetize rules*, unless otherwise specifically notated for overriding

## JS
- `"use strict";` begins all files
- Wrap whole file in an IIFE/self-executing function: `(() => {...})()`
- Use camelCase for methods & variables
- Add empty lines between coherent blocks of code to improve readability
- Add one space of padding between keyword & opening brace as well as closing
  parenthesis &  opening brace; e.g., `if (1 > 0) {...}`
- Do not add a space between method name & opening parenthesis,
  e.g., `function greeting() {...}`
- Declare all `const`, `let`, & `var` at the top of its scope
- Do not pollute global namespace with `let` declarations; refactor to keep
  `let` variables as scope-specific as possible

### Global namespace refactoring
_For each variable, ask yourself_:
- Is it a block-scoped variable?
- Have I declared the variable in the block it's scoped to?
- Should my variable be mutable (i.e., `let`) or immutable (i.e., `const`)?
