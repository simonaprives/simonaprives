# Copilot Instructions for Simona Prives Portfolio

## Architecture Overview

This is a **Lerna monorepo** with two packages:
- **`studio/`** - Sanity Studio v4 (TypeScript, React) - headless CMS for content management
- **`web/`** - Eleventy static site (Nunjucks templates) - public-facing portfolio website

**Data flow**: Sanity Studio → Sanity API → Eleventy data files → Nunjucks templates → static HTML

## Critical Workflows

### Development
```bash
npm run dev          # Runs both studio (port 3333) and web (port 8080) in parallel
cd studio && npm run dev    # Studio only
cd web && npm run serve     # Web only
```

### Building
```bash
npm run build        # Builds both packages
npm run build-studio # Studio only
npm run build-web    # Web only (outputs to web/_site)
```

### Node Version
**CRITICAL**: This project requires Node.js v20.19.0 (specified in root `package.json` engines field). Use `nvm use` or configure your environment accordingly.

## Sanity Studio Patterns

### Schema Structure (`studio/schemaTypes/`)
- **Singleton documents** (one per type): `homePage`, `aboutPage`, `cv`, `biolinks`, `artworkOnPaper`, `siteSettings`
  - These use hardcoded document IDs (e.g., `documentId('homePage')`) in [deskStructure.ts](studio/deskStructure.ts)
- **Collection documents**: `artworkExhibits`, `artworksInMotion`, `post`, `author`
  - Exhibits and In Motion use `@sanity/orderable-document-list` plugin for drag-and-drop ordering (see `orderRank` field)

### Custom Desk Structure
All content structure is defined in [deskStructure.ts](studio/deskStructure.ts) with custom ordering and icons. When adding new document types, they must be registered here to appear in the Studio UI.

### Image Pattern
All schemas using images reference the [mainImage.ts](studio/schemaTypes/objects/mainImage.ts) object type, which includes:
- `alt` (required, with character validation - no quotes or angle brackets)
- `caption` (optional)
- Hotspot enabled by default

## Eleventy (Web) Patterns

### Data Layer (`web/_data/`)
Each `.js` file in `_data/` becomes a global data object. Pattern:
```javascript
const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports = async function() {
  const query = groq`*[_type == "documentType"] { fields }`
  return await client.fetch(query).catch(err => { console.error(err); return [] })
}
```

**Image URL generation**: Use `@sanity/image-url` builder to create responsive images (see [homePage.js](web/_data/homePage.js) and [exhibits.js](web/_data/exhibits.js))

### Template Structure
- **Layouts**: [web/_includes/layouts/](web/_includes/layouts/) - `base.njk` is the primary layout
- **Components**: [web/_includes/components/](web/_includes/components/) - reusable partials
- **Pages with pagination**: [exhibit.njk](web/exhibit.njk), [post.njk](web/post.njk), [artwork-in-motion.njk](web/artwork-in-motion.njk)
  - Use Eleventy's pagination feature to generate individual pages from collections
  - Pattern: `permalink: "exhibits/{{ exhibit.slug }}/"`

### Sanity Client Configuration
[web/utils/sanityClient.js](web/utils/sanityClient.js) imports config from `studio/sanity.json` - ensures both packages use the same project/dataset settings. Critical for development sync.

## Code Philosophy (from .github/instructions/)

1. **Native platform first**: Prefer Sanity and Eleventy built-in features over custom code
2. **No CSS in templates**: Focus on semantic HTML structure; styling is handled separately
3. **Progressive enhancement**: Minimal JavaScript, rely on web standards
4. **Simple is better**: Avoid over-engineering solutions

## Common Tasks

### Adding a new singleton page
1. Create schema in `studio/schemaTypes/newPage.ts`
2. Register in `studio/schemaTypes/index.ts`
3. Add to `studio/deskStructure.ts` with hardcoded documentId
4. Create data file `web/_data/newPage.js` with GROQ query
5. Create template `web/new-page.njk`

### Adding a new collection type
1. Create schema in `studio/schemaTypes/newType.ts`
2. Register in `studio/schemaTypes/index.ts`
3. Add list item or orderableDocumentListDeskItem to `deskStructure.ts`
4. Create data file `web/_data/newTypes.js` (plural)
5. Create paginated template with `pagination:` frontmatter

### Working with GROQ queries
- Test queries in Sanity Vision (Vision plugin enabled in config)
- Use `| order(orderRank)` for orderable documents
- Always include `"slug": slug.current` for generating permalinks
- Use `->` for dereferencing (e.g., `relatedInMotion->`)

## Deployment Notes

- **Netlify**: Separate apps for studio and web (see [README.md](README.md) for build commands)
- **Studio CORS**: Must configure allowed origins in Sanity project settings for deployed Studio
- Studio is at `/studio` path when deployed on `now` (requires `basePath` in `sanity.json`)
