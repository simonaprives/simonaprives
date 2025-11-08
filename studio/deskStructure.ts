import S from '@sanity/desk-tool/structure-builder'

// Basic desk structure for the Studio. Customize as needed.
export default function DeskStructure() {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('post'),
      S.documentTypeListItem('author'),
      S.documentTypeListItem('category')
    ])
}
