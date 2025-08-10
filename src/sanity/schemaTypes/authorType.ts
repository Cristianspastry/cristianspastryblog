import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        }),
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Citazione',
      type: 'string',
    }),
    defineField({
      name: 'experience',
      title: 'Esperienza',
      type: 'string',
      description: 'Esempio: 15+ anni',
    }),
    defineField({
      name: 'recipesCount',
      title: 'Numero ricette',
      type: 'number',
    }),
    defineField({
      name: 'location',
      title: 'Località',
      type: 'string',
    }),
    defineField({
      name: 'social',
      title: 'Social',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Nome piattaforma' }),
            defineField({ name: 'url', type: 'url', title: 'URL profilo' }),
            defineField({ name: 'icon', type: 'string', title: 'Icona (es: facebook, instagram, etc.)' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'philosophy',
      title: 'Filosofia culinaria',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Titolo' }),
            defineField({ name: 'description', type: 'text', title: 'Descrizione' }),
            defineField({ name: 'icon', type: 'string', title: 'Icona (es: heart, users, book, camera, etc.)' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Storia',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
