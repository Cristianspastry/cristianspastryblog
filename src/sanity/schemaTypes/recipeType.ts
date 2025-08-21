import {DocumentTextIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const recipeType = defineType({
  name: 'recipe',
  title: 'Ricetta',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Titolo', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'mainImage', type: 'image', title: 'Immagine principale', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }], validation: Rule => Rule.required() }),
    defineField({ name: 'gallery', type: 'array', title: 'Immagini aggiuntive', of: [{ type: 'image', fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }] }] }),
    defineField({ name: 'categories', type: 'array', title: 'Categorie', of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })], validation: Rule => Rule.required().min(1) }),
    defineField({ name: 'tags', type: 'array', title: 'Tag', of: [{ type: 'string' }] }),
    defineField({ name: 'difficulty', type: 'string', title: 'Difficoltà', options: { list: [ { title: 'Facile', value: 'facile' }, { title: 'Media', value: 'media' }, { title: 'Difficile', value: 'difficile' } ] }, validation: Rule => Rule.required() }),
    defineField({ name: 'prepTime', type: 'number', title: 'Tempo di preparazione (minuti)', validation: Rule => Rule.required().min(1) }),
    defineField({ name: 'cookTime', type: 'number', title: 'Tempo di cottura (minuti)', validation: Rule => Rule.required().min(0) }),
    defineField({ name: 'servings', type: 'number', title: 'Porzioni', validation: Rule => Rule.required().min(1) }),
    defineField({
      name: 'cakePan',
      title: 'cakePan',
      type: 'string',
      description: 'Dimensioni della teglia (es. 20x30 cm, Ø 24 cm, ecc.)',
      placeholder: 'es. 24x18 cm, Ø 26 cm, 6 stampini...',
    }),
    defineField({ name: 'excerpt', type: 'text', title: 'Descrizione breve', rows: 4, validation: Rule => Rule.required() }),
    defineField({ name: 'body', type: 'blockContent', title: 'Descrizione lunga' }),
    defineField({
      name: 'ingredients',
      title: 'Ingredienti',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'ingredient', type: 'string', title: 'Ingrediente', validation: Rule => Rule.required() }),
            defineField({ name: 'amount', type: 'string', title: 'Quantità' }),
            defineField({ name: 'unit', type: 'string', title: 'Unità' }),
          ],
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'instructions',
      title: 'Procedimento',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'step', type: 'number', title: 'Numero step' }),
            defineField({ name: 'instruction', type: 'text', title: 'Testo step', validation: Rule => Rule.required() }),
            defineField({ name: 'image', type: 'image', title: 'Immagine step', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }] }),
          ],
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({ name: 'tips', type: 'array', title: 'Consigli dello chef', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'author', type: 'reference', title: 'Autore', to: { type: 'author' } }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Data pubblicazione', validation: Rule => Rule.required() }),
    defineField({
      name: "seo",
      title: "Impostazioni SEO",
      type: "seo",
      group: "seo" // se usi i gruppi
    }),
  ],
  groups : [
    {
      name: "seo",
      title: "SEO",
      icon: SearchIcon
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
