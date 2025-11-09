import { DocumentIcon } from '@sanity/icons'
import { CogIcon } from '@sanity/icons'

export default function deskStructure(S: any) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('About')
        .icon(DocumentIcon)
        .schemaType('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Biolinks')
        .icon(DocumentIcon)
        .schemaType('biolinks')
        .child(S.document().schemaType('biolinks').documentId('biolinks')),
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
