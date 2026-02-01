import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'
import {media} from 'sanity-plugin-media'
import { DiamondIcon } from '@sanity/icons'
import PreviewIframe from './components/PreviewIframe'

export default defineConfig({
  name: 'default',
  title: 'Simonas Studio',
  projectId: 'xkgmhl6j',
  dataset: 'production',
  subtitle: 'production',
  icon: DiamondIcon,
  plugins: [
    structureTool({
      structure: (S, context) => deskStructure(S, context),
      defaultDocumentNode: (S, {schemaType}) => {
        // Add Preview tab to orderable document types
        if (['artworkExhibits', 'artworksInMotion'].includes(schemaType)) {
          return S.document().views([
            S.view.form(),
            S.view.component(PreviewIframe).title('Preview')
          ])
        }
        return S.document()
      }
    }),
    visionTool(),
    media(),
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:8080'
          : 'https://simonaprives.netlify.app',
        previewMode: {
          enable: '/preview',
        },
      },
      resolve: {
        locations: (params, context) => {
          // Map URLs to documents for the "Documents on this page" panel
          if (params.documentType === 'homePage') {
            return {
              locations: [{
                title: 'Home Page',
                href: '/',
              }],
            }
          }
          
          if (params.documentType === 'aboutPage') {
            return {
              locations: [{
                title: 'About Page',
                href: '/about',
              }],
            }
          }
          
          if (params.documentType === 'biolinks') {
            return {
              locations: [{
                title: 'Biolinks Page',
                href: '/biolinks',
              }],
            }
          }
          
          if (params.documentType === 'cv') {
            return {
              locations: [{
                title: 'CV Page',
                href: '/cv',
              }],
            }
          }
          
          if (params.documentType === 'artworkExhibits' && params.document?.slug?.current) {
            return {
              locations: [{
                title: params.document.title || 'Exhibit',
                href: `/exhibits/${params.document.slug.current}`,
              }],
            }
          }
          
          if (params.documentType === 'artworksInMotion' && params.document?.slug?.current) {
            return {
              locations: [{
                title: params.document.title || 'In Motion',
                href: `/in-motion/${params.document.slug.current}`,
              }],
            }
          }
          
          if (params.documentType === 'post' && params.document?.slug?.current) {
            return {
              locations: [{
                title: params.document.title || 'Post',
                href: `/posts/${params.document.slug.current}`,
              }],
            }
          }
          
          return null
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
