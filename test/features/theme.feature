@theme
Feature: The theme's generated files, its fonts, and the utilities Tailwind makes from it
  The generated files match tokens.json, every font file fonts.css names is
  here, and Tailwind turns theme.css into the utilities sites use.

  Scenario: theme.css and tokens.css are what tools/build.js writes from tokens.json
    Then theme.css and tokens.css are what tools/build.js writes from tokens.json

  Scenario: Every dark token overrides a light one
    Then every dark token overrides a light one

  Scenario: Every font fonts.css names is in fonts/, and every font in fonts/ is named
    Then every font fonts.css names is in fonts/, and every font in fonts/ is named

  Scenario: The font families fonts.css declares are the ones the tokens name first
    Then the font families fonts.css declares are the ones the tokens name first

  Scenario: Tailwind 4 makes the utilities from theme.css
    Then Tailwind 4 makes the utilities from theme.css

  Scenario: shadow-panel follows dark mode, as the colours do
    Then shadow-panel follows dark mode, as the colours do
