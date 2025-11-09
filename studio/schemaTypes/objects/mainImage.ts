export default {
  name: 'mainImage',
  type: 'image',
  title: 'Image',
  options: {
    hotspot: true
  },
  fields: [
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      options: {
        isHighlighted: true
      }
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description: `Important for SEO and accessibility. Avoid special characters like " ' < >.`,
      validation: (Rule: any) =>
        Rule.required().custom((value: any) => {
          if (!value) return 'You have to fill out the alternative text.';
          // forbid straight and curly quotes and angle brackets which can break HTML attributes/markup
          const badChars = /["'<>]/;
          return badChars.test(value)
            ? 'Alt text must not contain quotation marks or angle brackets (" \' “ ” ‘ ’ < >). Please remove them.'
            : true;
        }),
      options: {
        hotspot: true
      }
    }
  ],
  // Use a simple preview: alt as title, caption as subtitle, and pass the native
  // asset object through as media so Sanity's built-in preview renderer shows
  // thumbnails without custom shaping.
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
      asset: 'asset',
    },
    prepare(selection: any) {
      const {alt, caption, asset} = selection || {}
      return {
        title: alt || 'Image',
        subtitle: caption || undefined,
        media: asset as any,
      }
    }
  }

}