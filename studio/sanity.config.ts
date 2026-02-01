import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
// import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'
import {media} from 'sanity-plugin-media'
import { DiamondIcon } from '@sanity/icons'
import {dashboardTool, projectInfoWidget, projectUsersWidget} from '@sanity/dashboard'
import {netlifyWidget} from 'sanity-plugin-dashboard-widget-netlify'

export default defineConfig({
  name: 'default',
  title: 'Simonas Studio',
  projectId: 'xkgmhl6j',
  dataset: 'production',
  subtitle: 'production',
  icon: DiamondIcon,
  plugins: [
    dashboardTool({
      widgets: [
        netlifyWidget({
          title: 'Site Deployment',
          sites: [
            {
              title: 'Website',
              apiId: 'd2edea43-7501-454f-a676-bf81b21bfe84',
              buildHookId: '697fe021388a2bde75648536',
              name: 'simonaprives',
            }
          ]
        }),
        projectInfoWidget(),
        projectUsersWidget(),
      ]
    }),
    structureTool({
      title: 'Desk',
      structure: (S, context) => deskStructure(S, context)
    }),
    // visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
})
