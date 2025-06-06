# Highlight.js Themes Showcase

A comprehensive visual guide to all available [Highlight.js](https://highlightjs.org/) themes, showcasing syntax highlighting for Python code. 

{{LIMITED_MODE_WARNING}}

## 🎯 Theme Gallery

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
- **Import statements** (`import asyncio`, `from typing`)
- **Decorators** (`@property`)
- **Type annotations** (`List[str]`, `AsyncGenerator[str, None]`)
- **Async/generators** (`async def`, `yield`, `AsyncGenerator`)
- **Docstrings** (function documentation strings)
- **Regular expressions** (`r"^[a-zA-Z0-9._%+-]+@..."`)
- **F-strings** (`f"Valid: {email} (#{count + 1})"`)
- **String literals** (raw strings, regular strings)
- **Numbers** (`100`, `0.1`, `1`, `2`)
- **Comments** (`# Track processed emails`)
- **Operators** (`>=`, `+`, `+=`)
- **Keywords** (`async`, `await`, `yield`, `if`, `for`, `break`)
- **Built-in functions** (`strip()`, `match()`)

## Running the Generator
To regenerate screenshots or adapt for different code samples:

```bash
# Install dependencies
npm install

# Generate all screenshots (themes are discovered automatically)
node scripts/generate.js
```

## 📊 Statistics
- **Total themes available**: {{TOTAL_THEMES}}
- **Themes displayed**: {{THEME_COUNT}}

## 🎨 Popular Themes
Some of the most popular and widely-used themes include:
- **GitHub** - Clean, professional light theme
- **GitHub Dark** - Modern dark variant of GitHub theme
- **Monokai** - Classic dark theme with vibrant colors
- **Atom One Dark** - Popular dark theme from Atom editor
- **VS Code Dark+** (Tomorrow Night) - Default VS Code dark theme
- **Solarized Dark/Light** - Scientifically designed color scheme
- **Nord** - Arctic-inspired cool color palette

