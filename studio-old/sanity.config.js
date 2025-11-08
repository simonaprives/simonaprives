import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schema from './schemas/schema'

export default defineConfig({
  name: 'simonaprives',
  title: 'Simona Prives',
  projectId: 'xkgmhl6j',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schema.types || [] }
})
