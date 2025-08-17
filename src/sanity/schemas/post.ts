import {defineType, defineField, defineArrayMember} from 'sanity'

const post = defineType({
  name: 'post',
  title: 'Ricetta',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine principale',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Testo alternativo' }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Immagini aggiuntive',
      type: 'array',
      of: [{ type: 'image', fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }] }],
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
      validation: Rule =>
        Rule.required()
          .min(1)
          .custom(async (categories, context) => {
            if (!Array.isArray(categories) || categories.length === 0) return 'Seleziona almeno una categoria';
            // Fetch le categorie referenziate per ottenere lo slug
            // Sanity v3: context.getClient() requires an argument (apiVersion)
            const client = typeof context.getClient === 'function' ? context.getClient({apiVersion: '2025-08-08'}) : undefined;
            if (!client) return true; // fallback: non validare
            const ids = categories
              .map((c) => c && typeof c === 'object' && '_ref' in c ? (c as { _ref?: string })._ref : undefined)
              .filter((id): id is string => Boolean(id));
            if (!ids.length) return true;
            type CategorySlug = { slug?: { current?: string } };
            const cats: CategorySlug[] = await client.fetch(
              `*[_type == "category" && _id in $ids]{slug}`,
              { ids }
            );
            const hasRicetta = cats.some((c) => {
              const slug = c.slug?.current?.toLowerCase();
              return slug === 'ricetta' || slug === 'ricette';
            });
            return hasRicetta
              ? true
              : 'Devi includere la categoria Ricetta o Ricette per ogni ricetta!';
          }),
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficoltà',
      type: 'string',
      options: {
        list: [
          { title: 'Facile', value: 'facile' },
          { title: 'Media', value: 'media' },
          { title: 'Difficile', value: 'difficile' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'prepTime',
      title: 'Tempo di preparazione (minuti)',
      type: 'number',
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'cookTime',
      title: 'Tempo di cottura (minuti)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'servings',
      title: 'Porzioni',
      type: 'number',
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'teglia',
      title: 'Teglia',
      type: 'string',
      description: 'Dimensioni della teglia (es. 20x30 cm, Ø 24 cm, ecc.)',
      placeholder: 'es. 24x18 cm, Ø 26 cm, 6 stampini...',
    }),
    defineField({
      name: 'excerpt',
      title: 'Descrizione breve',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
    }),
    
    defineField({
      name: 'body',
      title: 'Descrizione lunga',
      type: 'blockContent',
    }),
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
    defineField({
      name: 'tips',
      title: 'Consigli dello chef',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'author',
      title: 'Autore',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data pubblicazione',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Data pubblicazione, più recente',
      name: 'publishedAt',
      by: [
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
  ],
});

export default post;