import {structureTool, StructureBuilder} from 'sanity/structure'
import { DocumentIcon, CogIcon, ImagesIcon, VideoIcon, HomeIcon, MarkerIcon } from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import PreviewIframe from './components/PreviewIframe'

export default function deskStructure(S: any, context: any) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('homePage')
        .title('Home')
        .icon(HomeIcon)
        .schemaType('homePage')
        .child(() => 
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .views([
              S.view.form(),
              S.view.component(PreviewIframe).title('Preview')
            ])
        ),
      S.listItem()
        .id('aboutPage')
        .title('About')
        .icon(DocumentIcon)
        .schemaType('aboutPage')
        .child(() => 
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .views([
              S.view.form(),
              S.view.component(PreviewIframe).title('Preview')
            ])
        ),
      S.listItem()
        .id('cv')
        .title('CV')
        .icon(DocumentIcon)
        .schemaType('cv')
        .child(() => 
          S.document()
            .schemaType('cv')
            .documentId('cv')
            .views([
              S.view.form(),
              S.view.component(PreviewIframe).title('Preview')
            ])
        ),
      S.listItem()
        .id('biolinks')
        .title('Biolinks')
        .icon(DocumentIcon)
        .schemaType('biolinks')
        .child(() => 
          S.document()
            .schemaType('biolinks')
            .documentId('biolinks')
            .views([
              S.view.form(),
              S.view.component(PreviewIframe).title('Preview')
            ])
        ),
      // Drag-to-order Exhibits with preview views
      orderableDocumentListDeskItem({
        type: 'artworkExhibits',
        title: 'Exhibits',
        icon: MarkerIcon,
        S,
        context,
      }),
      // Drag-to-order In Motion with preview views
      orderableDocumentListDeskItem({
        type: 'artworksInMotion',
        title: 'In Motion',
        icon: VideoIcon,
        S,
        context,
      }),
      S.listItem()
        .id('artworkOnPaper')
        .title('On Paper')
        .icon(ImagesIcon)
        .schemaType('artworkOnPaper')
        .child(() => S.document().schemaType('artworkOnPaper').documentId('artworkOnPaper')),
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
