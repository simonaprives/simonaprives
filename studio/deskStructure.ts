import {structureTool, StructureBuilder} from 'sanity/structure'
import { DocumentIcon } from '@sanity/icons'
import { CogIcon } from '@sanity/icons'
import { ImagesIcon } from '@sanity/icons'
import { VideoIcon } from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default function deskStructure(S: any, context: any) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('aboutPage')
        .title('About')
        .icon(DocumentIcon)
        .schemaType('aboutPage')
        .child(() => S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .id('cv')
        .title('CV')
        .icon(DocumentIcon)
        .schemaType('cv')
        .child(() => S.document().schemaType('cv').documentId('cv')),
      S.listItem()
        .id('biolinks')
        .title('Biolinks')
        .icon(DocumentIcon)
        .schemaType('biolinks')
        .child(() => S.document().schemaType('biolinks').documentId('biolinks')),
      // Drag-to-order Exhibits using the orderable-document-list plugin
      orderableDocumentListDeskItem({
        type: 'artworkExhibits',
        title: 'Exhibits',
        icon: ImagesIcon,
        // pass S/context from the structure callback
        S,
        context,
      }),
      S.listItem()
        .id('artworkOnPaper')
        .title('On Paper')
        .icon(ImagesIcon)
        .schemaType('artworkOnPaper')
        .child(() => S.document().schemaType('artworkOnPaper').documentId('artworkOnPaper')),
      S.listItem()
        .id('artworksInMotion')
        .title('In motion')
        .icon(VideoIcon)
        .schemaType('artworksInMotion')
        .child(() => S.document().schemaType('artworksInMotion').documentId('artworskInMotion')),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(() => S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.documentTypeListItem('post')
    ])
}
