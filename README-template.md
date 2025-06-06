# Highlight.js Themes Showcase

A visual guide to all {{THEME_COUNT}} [Highlight.js](https://highlightjs.org/) themes, showcasing syntax highlighting for Python code. 

{{LIMITED_MODE_WARNING}}

## 🎨 Theme Gallery

{{ALL_THEMES}}

## 🛠️ Technical Details

### Technologies Used

- **Highlight.js 11.9.0** - Syntax highlighting library
- **Puppeteer 24.10.0** - Automated screenshot generation
- **Node.js** - Build system and automation

### Project Structure

```
highlightjs-themes-demo/
├── demo.html              # HTML template for theme display
├── demo-code.py           # Python code snippet used in all themes
├── package.json           # Project dependencies
├── scripts/
│   └── generate.js  # Discovers themes and captures screenshots with Puppeteer
└── screenshots/           # Generated PNG screenshots for each theme
    ├── a11y-dark.png
    ├── a11y-light.png
    └── ... ({{THEME_COUNT}} total)
```

### Syntax Elements Showcased
The demo Python code demonstrates syntax highlighting for:
- **Import statements** (`from typing import`)
- **Decorators** (`@profile`)
- **Type annotations** (`List[Tuple[str, int]]`, `Generator[str, None]`, `int`)
- **Function definitions** (`def process_repositories`)
- **Docstrings** (function documentation strings)
- **Tuple unpacking** (`(name, n_stars)`)
- **Enumerate function** (`enumerate(repos)`)
- **F-strings** (`f"Repo {i}: {name} ({n_stars} stars)"`)
- **String literals** (regular strings)
- **Numbers** (`100`)
- **Comments** (`# Check number of stars and format output`)
- **Operators** (`>=`)
- **Keywords** (`def`, `yield`, `if`, `for`)
- **Built-in functions** (`enumerate()`)

## Running the Generator

To regenerate screenshots or adapt for different code samples:

```bash
# Install dependencies
npm install

# Generate all screenshots (themes are discovered automatically)
node scripts/generate.js
```

## ⭐ Popular Themes

Some of the most popular and widely-used themes include:
- **GitHub** - Clean, professional light theme
- **GitHub Dark** - Modern dark variant of GitHub theme
- **Monokai** - Classic dark theme with vibrant colors
- **Atom One Dark** - Popular dark theme from Atom editor
- **VS Code Dark+** (Tomorrow Night) - Default VS Code dark theme
- **Solarized Dark/Light** - Scientifically designed color scheme
- **Nord** - Arctic-inspired cool color palette

