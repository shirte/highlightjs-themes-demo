const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Parse command line arguments
const args = process.argv.slice(2);
const fullMode = args.includes('--full');

/**
 * Recursively discover all available highlight.js themes from the package
 */
async function discoverThemes() {
    console.log('Discovering themes from highlight.js package...');
    
    const themesPath = path.join(__dirname, '..', 'node_modules', 'highlight.js', 'styles');
    
    if (!await fs.pathExists(themesPath)) {
        throw new Error(`Could not find highlight.js styles directory at ${themesPath}`);
    }
    
    const themes = [];
    
    /**
     * Recursively scan directory for CSS files
     */
    async function scanDirectory(dirPath, relativePath = '') {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativeEntryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
            
            if (entry.isFile() && entry.name.endsWith('.css')) {
                // Extract theme name without .css extension and .min
                let themeName = entry.name.replace(/\.min\.css$|\.css$/, '');
                
                // If we're in a subdirectory, include the path
                if (relativePath) {
                    themeName = `${relativePath}/${themeName}`;
                }
                
                if (!themes.includes(themeName)) {
                    themes.push(themeName);
                }
            } else if (entry.isDirectory()) {
                // Recursively scan subdirectories
                await scanDirectory(fullPath, relativeEntryPath);
            }
        }
    }
    
    // Start scanning from the root styles directory
    await scanDirectory(themesPath);
    
    // Sort themes for consistent ordering, but keep subdirectory structure
    themes.sort((a, b) => {
        // Sort by directory first, then by name
        const aDirDepth = (a.match(/\//g) || []).length;
        const bDirDepth = (b.match(/\//g) || []).length;
        
        if (aDirDepth !== bDirDepth) {
            return aDirDepth - bDirDepth;
        }
        
        return a.localeCompare(b);
    });
    
    console.log(`Discovered ${themes.length} themes from package`);
    return themes;
}

/**
 * Generate README.md file with all discovered themes
 */
async function generateReadme(themes, pythonCode, isFullMode = true, totalThemes = themes.length) {
    console.log('Generating README.md file...');
    
    // Read the README template
    const templatePath = path.resolve('./README-template.md');
    let readmeTemplate = await fs.readFile(templatePath, 'utf8');
    
    // Helper function to format theme name for display with path
    const formatThemeName = (theme) => {
        if (theme.includes('/')) {
            const [directory, ...nameParts] = theme.split('/');
            const themeName = nameParts.join('/');
            
            // Format the directory name
            const formattedDirectory = directory.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            // Format the theme name
            const formattedThemeName = themeName.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            return `${formattedDirectory} / ${formattedThemeName}`;
        }
        
        return theme.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Generate all themes section
    const allThemesSection = themes.map(theme => 
        `#### ${formatThemeName(theme)}\n![${theme}](screenshots/${theme.replace(/\//g, '_')}.png)`
    ).join('\n\n');

    // Add warning banner for limited mode
    const limitedModeWarning = !isFullMode ? `
> **⚠️ Limited Mode Active**  
> This README shows only the first ${themes.length} themes out of ${totalThemes} available themes.  
> To generate all themes, run: \`node scripts/generate.js --full\`

` : '';
    
    // Replace template placeholders
    const readmeContent = readmeTemplate
        .replace('{{LIMITED_MODE_WARNING}}', limitedModeWarning)
        .replace('{{ALL_THEMES}}', allThemesSection)
        .replace(/{{THEME_COUNT}}/g, themes.length.toString())
        .replace('{{TOTAL_THEMES}}', totalThemes.toString());

    // Write README file
    await fs.writeFile('./README.md', readmeContent);
    console.log('README.md generated successfully!');
}

async function generateScreenshots() {
    console.log('Starting screenshot generation...');
    console.log(`Mode: ${fullMode ? 'Full (all themes)' : 'Limited (first 10 themes)'}`);
    
    // Download and cache highlight.js code once
    console.log('Downloading highlight.js...');
    const https = require('https');
    const highlightjsCode = await new Promise((resolve, reject) => {
        https.get('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
    console.log('Highlight.js downloaded successfully');
    
    // Dynamically discover themes from the highlight.js package
    const allThemes = await discoverThemes();
    
    // Limit themes based on command line parameter
    let themes;
    if (fullMode) {
        themes = allThemes;
    } else {
        // In limited mode, show first 5 regular themes and first 5 base16 themes for demonstration
        const regularThemes = allThemes.filter(theme => !theme.includes('/')).slice(0, 5);
        const base16Themes = allThemes.filter(theme => theme.startsWith('base16/')).slice(0, 5);
        themes = [...regularThemes, ...base16Themes];
    }
    
    if (!fullMode && allThemes.length > 10) {
        console.log(`Limited mode: Processing ${themes.length} themes out of ${allThemes.length} total themes.`);
        console.log(`Use --full flag to process all themes: node scripts/generate.js --full`);
    }
    
    // Read the Python demo code
    const pythonCode = await fs.readFile('./demo-code.py', 'utf8');
    
    // Read the HTML template
    const htmlTemplate = await fs.readFile('./demo.html', 'utf8');
    
    // Clean up and recreate screenshots directory
    console.log('Cleaning up existing screenshots...');
    await fs.remove('./screenshots');
    await fs.ensureDir('./screenshots');
    
    // Launch browser in debug mode (visible window)
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({
        width: 600,
        height: 800
    });
    
    console.log(`Generating screenshots for ${themes.length} themes...`);
    
    for (let i = 0; i < themes.length; i++) {
        const theme = themes[i];
        console.log(`Processing theme ${i + 1}/${themes.length}: ${theme}`);
        
        try {
            // Create local file path for theme CSS and read its content
            const themeCssPath = path.resolve(__dirname, '..', 'node_modules', 'highlight.js', 'styles', `${theme}.min.css`);
            let themeCssContent = '';
            
            try {
                themeCssContent = await fs.readFile(themeCssPath, 'utf8');
            } catch (err) {
                // If .min.css doesn't exist, try .css
                const fallbackPath = themeCssPath.replace('.min.css', '.css');
                themeCssContent = await fs.readFile(fallbackPath, 'utf8');
            }
            
            // Create HTML content with inlined CSS and JS
            const htmlContent = htmlTemplate
                .replace('{{PYTHON_CODE_PLACEHOLDER}}', pythonCode)
                .replace('{{THEME_CSS_CONTENT}}', themeCssContent)
                .replace('{{HIGHLIGHTJS_CODE}}', highlightjsCode);
            
            // Write HTML file for this theme to temp directory
            const tempHtmlPath = path.join(os.tmpdir(), `highlightjs-demo-${theme.replace(/\//g, '_')}-${Date.now()}.html`);
            await fs.writeFile(tempHtmlPath, htmlContent);
            
            // Navigate to the theme-specific HTML file
            await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'domcontentloaded' });
            
            // Wait for highlight.js to complete processing
            await page.waitForFunction(() => window.highlightingComplete === true, { timeout: 10000 });
            
            // Take screenshot of just the code element
            const codeElement = await page.$('pre code');
            if (codeElement) {
                const screenshotPath = `./screenshots/${theme.replace(/\//g, '_')}.png`;
                await codeElement.screenshot({
                    path: screenshotPath,
                    type: 'png'
                });
            }
            
            // Clean up the temporary HTML file
            await fs.remove(tempHtmlPath);
            
        } catch (error) {
            console.error(`Error processing theme ${theme}:`, error);
        }
    }
    
    await browser.close();
    
    console.log('Screenshot generation complete!');
    
    // Generate README with discovered themes and Python code
    await generateReadme(themes, pythonCode, fullMode, allThemes.length);
    
    console.log('All tasks completed successfully!');
    console.log(`Generated ${themes.length} screenshots and updated README.md`);
}

generateScreenshots().catch(console.error);
