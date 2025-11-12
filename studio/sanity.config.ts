import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'
import { DiamondIcon } from '@sanity/icons'

export default defineConfig({
  name: 'default',
  title: 'Simonas Studio',
  projectId: 'xkgmhl6j',
  dataset: 'production',
  subtitle: 'production',
  icon: DiamondIcon,
  plugins: [structureTool({structure: deskStructure}), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
