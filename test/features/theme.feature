@theme
Feature: The theme's generated files, its fonts, and the utilities Tailwind makes from it
  The generated files match tokens.json, every font file fonts.css names is
  here, and Tailwind turns theme.css into the utilities sites use.

  Scenario: theme.css and tokens.css are what tools/build.js writes from tokens.json
    When I run "node tools/build.js --check"
    Then it succeeds
    And stderr does not mention "is stale"

  Scenario: A generated file that differs from what tools/build.js writes is stale
    Given a scratch directory
    And a file "tools/build.js" copied from "tools/build.js"
    And a file "tokens.json" copied from "tokens.json"
    And a file "theme.css" copied from "theme.css"
    And a file "tokens.css" holding "an old tokens.css"
    When I run "node tools/build.js --check"
    Then it fails
    And stderr mentions "tokens.css is stale: run npm run build"
    And stderr does not mention "theme.css is stale"
    And the file "tokens.css" holds "an old tokens.css"

  Scenario: tools/build.js writes what is stale, and then nothing is
    Given a scratch directory
    And a file "tools/build.js" copied from "tools/build.js"
    And a file "tokens.json" copied from "tokens.json"
    And a file "theme.css" copied from "theme.css"
    When I run "node tools/build.js"
    And I run "node tools/build.js --check"
    Then it succeeds
    And the file "tokens.css" includes "Written by tools/build.js from tokens.json"

  Scenario: Every dark token overrides a light one
    When I list the dark tokens that override no light one
    Then the result is "[]"

  Scenario: Every font fonts.css names is in fonts/, and every font in fonts/ is named
    When I list the font files fonts.css names
    Then the result is:
      """
      ["fonts/nunito-latin-ext-wght-normal.woff2", "fonts/nunito-latin-wght-normal.woff2",
       "fonts/nunito-sans-latin-ext-wght-normal.woff2", "fonts/nunito-sans-latin-wght-normal.woff2"]
      """
    And the directory "fonts" holds:
      """
      OFL-nunito-sans.txt
      OFL-nunito.txt
      nunito-latin-ext-wght-normal.woff2
      nunito-latin-wght-normal.woff2
      nunito-sans-latin-ext-wght-normal.woff2
      nunito-sans-latin-wght-normal.woff2
      """

  Scenario: fonts.css declares the families Nunito and Nunito Sans
    When I list the font families fonts.css declares
    Then the result includes "Nunito"
    And the result includes "Nunito Sans"

  Scenario Outline: The font families fonts.css declares are the ones the tokens name first
    When I read the first font family the token "<token>" names
    Then the result is "<family>"

    Examples:
      | token        | family      |
      | font-sans    | Nunito Sans |
      | font-display | Nunito      |

  Scenario: Tailwind 4 makes the utilities from theme.css
    When Tailwind 4 builds "bg-surface text-muted border-rule font-display rounded-panel shadow-panel text-seed" from theme.css
    Then the result includes "background-color: var(--color-surface)"
    And the result includes "color: var(--color-muted)"
    And the result includes "border-color: var(--color-rule)"
    And the result includes "font-family: var(--font-display)"
    And the result includes "border-radius: var(--radius-panel)"
    And the result includes "color: var(--color-seed)"

  Scenario: shadow-panel takes its value from a property each mode sets
    When Tailwind 4 builds "shadow-panel" from theme.css
    Then the result includes "--tw-shadow: var(--shadow-panel-value)"

  Scenario Outline: In dark mode, the panel's shadow is darker, as the colours are
    When I read the dark block of "<file>"
    Then the result includes "<property>: 0 8px 28px rgba(0, 0, 0, 0.5)"

    Examples:
      | file       | property             |
      | theme.css  | --shadow-panel-value |
      | tokens.css | --shadow-panel       |
