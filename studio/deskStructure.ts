import {structureTool, StructureBuilder} from 'sanity/structure'
import { DocumentIcon } from '@sanity/icons'
import { CogIcon } from '@sanity/icons'
import { ImagesIcon } from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default function deskStructure(S: any, context: any) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About')
        .icon(DocumentIcon)
        .schemaType('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('CV')
        .icon(DocumentIcon)
        .schemaType('cv')
        .child(S.document().schemaType('cv').documentId('cv')),
      S.listItem()
        .title('Biolinks')
        .icon(DocumentIcon)
        .schemaType('biolinks')
        .child(S.document().schemaType('biolinks').documentId('biolinks')),
      // Drag-to-order Exhibits using the orderable-document-list plugin
      orderableDocumentListDeskItem({
        type: 'artworkExhibits',
        title: 'Exhibits',
        icon: ImagesIcon,
        // pass S/context from the structure callback
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.documentTypeListItem('post')
    ])
}
