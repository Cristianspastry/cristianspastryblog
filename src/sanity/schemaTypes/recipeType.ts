import {DocumentTextIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import { commonPreparations, getAllIngredientsWithCategory, pastryUnits } from '../lib/utils'

const allIngredientsList = getAllIngredientsWithCategory()

export const recipeType = defineType({
  name: 'recipe',
  title: 'Ricetta di Pasticceria',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Titolo', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'mainImage', type: 'image', title: 'Immagine principale', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }], validation: Rule => Rule.required() }),
    defineField({ name: 'gallery', type: 'array', title: 'Immagini aggiuntive', of: [{ type: 'image', fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }] }] }),
    defineField({ name: 'categories', type: 'array', title: 'Categorie', of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })], validation: Rule => Rule.required().min(1) }),
    defineField({ name: 'tags', type: 'array', title: 'Tag', of: [{ type: 'string' }] }),
    defineField({ 
      name: 'difficulty', 
      type: 'string', 
      title: 'Difficoltà', 
      options: { 
        list: [ 
          { title: '⭐ Principiante', value: 'principiante' }, 
          { title: '⭐⭐ Intermedio', value: 'intermedio' }, 
          { title: '⭐⭐⭐ Avanzato', value: 'avanzato' }, 
          { title: '👨‍🍳 Professionale', value: 'professionale' } 
        ] 
      }, 
      validation: Rule => Rule.required() 
    }),
    defineField({ name: 'prepTime', type: 'number', title: 'Tempo di preparazione (minuti)', validation: Rule => Rule.required().min(1) }),
    defineField({ name: 'cookTime', type: 'number', title: 'Tempo di cottura (minuti)', validation: Rule => Rule.required().min(0) }),
    defineField({ name: 'restTime', type: 'number', title: 'Tempo di riposo/lievitazione (minuti)', description: 'Per impasti lievitati, creme da raffreddare, ecc.' }),
    defineField({ name: 'servings', type: 'number', title: 'Porzioni', validation: Rule => Rule.required().min(1) }),
    defineField({
      name: 'cakePan',
      title: 'Stampo/Teglia',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Tipo di stampo',
          type: 'string',
          options: {
            list: [
              { title: '🍰 Stampo tondo', value: 'tondo' },
              { title: '📦 Stampo quadrato/rettangolare', value: 'rettangolare' },
              { title: '🍞 Stampo plumcake', value: 'plumcake' },
              { title: '🌪️ Stampo bundt', value: 'bundt' },
              { title: '📏 Teglia da forno', value: 'teglia' },
              { title: '🧁 Stampini monoporzione', value: 'monoporzione' },
              { title: '🔓 Stampo a cerniera', value: 'cerniera' },
              { title: '⭕ Ring mould', value: 'ring' },
              { title: '✨ Altro', value: 'altro' }
            ]
          }
        }),
        defineField({
          name: 'size',
          title: 'Dimensioni',
          type: 'string',
          placeholder: 'es. Ø 24 cm, 20x30 cm, 6 stampini da 8 cm...'
        }),
        defineField({
          name: 'material',
          title: 'Materiale consigliato',
          type: 'string',
          options: {
            list: [
              { title: 'Alluminio', value: 'alluminio' },
              { title: 'Acciaio inox', value: 'acciaio' },
              { title: 'Antiaderente', value: 'antiaderente' },
              { title: 'Silicone', value: 'silicone' },
              { title: 'Ceramica', value: 'ceramica' },
              { title: 'Vetro', value: 'vetro' }
            ]
          }
        })
      ]
    }),
    defineField({ name: 'excerpt', type: 'text', title: 'Descrizione breve', rows: 4, validation: Rule => Rule.required() }),
    defineField({ name: 'body', type: 'blockContent', title: 'Descrizione lunga' }),
    
    // INGREDIENTI CON LISTA PREDEFINITA
    defineField({
      name: 'ingredients',
      title: 'Ingredienti',
      type: 'array',
      description: 'Seleziona ingredienti dal database completo di pasticceria (oltre 400 ingredienti categorizzati)',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Ingrediente',
          fields: [
            defineField({
              name: 'ingredient',
              type: 'string',
              title: 'Nome ingrediente',
              options: {
                list: allIngredientsList,
                layout: 'dropdown'
              },
              validation: Rule => Rule.required(),
              // Custom input per ricerca
              components: {
                input: (props) => {
                  // Qui potresti aggiungere un componente custom con ricerca
                  // Per ora usa il dropdown standard di Sanity
                  return props.renderDefault(props)
                }
              }
            }),
            defineField({
              name: 'customIngredient',
              type: 'string', 
              title: 'Ingrediente personalizzato',
              description: 'Se l\'ingrediente non è nella lista, inseriscilo qui',
              hidden: ({parent}) => !!parent?.ingredient
            }),
            defineField({ 
              name: 'amount', 
              type: 'number', 
              title: 'Quantità',
              description: 'Usa numeri decimali per precisione (es. 125.5)',
              validation: Rule => Rule.required().min(0)
            }),
            defineField({ 
              name: 'unit', 
              type: 'string', 
              title: 'Unità di misura',
              options: {
                list: pastryUnits
              },
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'preparation',
              type: 'string',
              title: 'Preparazione',
              options: {
                list: commonPreparations.map(prep => ({ title: prep, value: prep }))
              },
              description: 'Come deve essere preparato l\'ingrediente'
            }),
            defineField({
              name: 'customPreparation',
              type: 'string',
              title: 'Preparazione personalizzata', 
              description: 'Se la preparazione non è nella lista, inseriscila qui',
              hidden: ({parent}) => !!parent?.preparation
            }),
            defineField({
              name: 'notes',
              type: 'string',
              title: 'Note aggiuntive',
              placeholder: 'es. della migliore qualità, senza glutine...',
              description: 'Note opzionali aggiuntive'
            }),
            defineField({
              name: 'isOptional',
              type: 'boolean',
              title: 'Ingrediente opzionale',
              initialValue: false
            }),
            defineField({
              name: 'category',
              type: 'string',
              title: 'Categoria',
              options: {
                list: [
                  { title: '🌾 Farine e cereali', value: 'farine' },
                  { title: '🍯 Dolcificanti', value: 'dolcificanti' },
                  { title: '🧈 Grassi', value: 'grassi' },
                  { title: '🥛 Liquidi', value: 'liquidi' },
                  { title: '🥚 Uova e derivati', value: 'uova' },
                  { title: '🧁 Lieviti', value: 'lieviti' },
                  { title: '🍫 Cioccolato e cacao', value: 'cioccolato' },
                  { title: '🌰 Frutta secca', value: 'fruttaSecca' },
                  { title: '🍓 Frutta fresca', value: 'fruttaFresca' },
                  { title: '✨ Aromi e spezie', value: 'aromi' },
                  { title: '🧂 Sale e acidi', value: 'saleAcidi' },
                  { title: '🍮 Gelatine e addensanti', value: 'gelatine' },
                  { title: '🥄 Creme e preparazioni', value: 'creme' },
                  { title: '🎂 Decorazioni', value: 'decorazioni' },
                  { title: '🍯 Confetture e conserve', value: 'conserve' }
                ]
              },
              description: 'Categoria automatica (puoi modificarla se necessario)'
            })
          ],
          preview: {
            select: {
              ingredient: 'ingredient',
              customIngredient: 'customIngredient',
              amount: 'amount',
              unit: 'unit',
              preparation: 'preparation',
              customPreparation: 'customPreparation',
              isOptional: 'isOptional'
            },
            prepare({ingredient, customIngredient, amount, unit, preparation, customPreparation, isOptional}) {
              const ingredientName = ingredient || customIngredient || 'Ingrediente senza nome'
              const quantity = `${amount || ''} ${unit || ''}`.trim()
              const prep = preparation || customPreparation || ''
              const optional = isOptional ? ' (opzionale)' : ''
              
              // Estrae emoji dall'ingrediente se presente
              const emoji = ingredient ? ingredient.split(' ')[0] : '🥄'
              const cleanName = ingredient ? ingredient.replace(/^[^\w\s]+\s/, '') : ingredientName
              
              return {
                title: `${emoji} ${cleanName}${optional}`,
                subtitle: `${quantity}${prep ? ` - ${prep}` : ''}`
              }
            }
          }
        }),
      ],
      validation: Rule => Rule.required().min(1).max(50),
    }),
    
    // ISTRUZIONI SPECIFICHE PER PASTICCERIA
    defineField({
      name: 'instructions',
      title: 'Procedimento',
      type: 'array',
      description: 'Passaggi dettagliati per la preparazione',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Passaggio',
          fields: [
            defineField({ 
              name: 'instruction', 
              type: 'text', 
              title: 'Descrizione del passaggio',
              rows: 4,
              placeholder: 'Descrivi dettagliatamente cosa fare...',
              validation: Rule => Rule.required().min(10).max(800)
            }),
            defineField({
              name: 'technique',
              type: 'string',
              title: 'Tecnica di pasticceria',
              options: {
                list: [
                  { title: '🥄 Mescolare/Amalgamare', value: 'mixing' },
                  { title: '💨 Montare', value: 'whipping' },
                  { title: '🌡️ Temperare', value: 'tempering' },
                  { title: '📏 Impastare', value: 'kneading' },
                  { title: '❄️ Raffreddare', value: 'cooling' },
                  { title: '🔥 Cuocere', value: 'baking' },
                  { title: '⏳ Far riposare', value: 'resting' },
                  { title: '🎯 Modellare', value: 'shaping' },
                  { title: '🎨 Decorare', value: 'decorating' },
                  { title: '🧊 Congelare', value: 'freezing' },
                  { title: '⚡ Altro', value: 'other' }
                ]
              }
            }),
            defineField({ 
              name: 'duration', 
              type: 'number', 
              title: 'Tempo (minuti)',
              description: 'Tempo stimato per questo passaggio',
              validation: Rule => Rule.min(0).max(999)
            }),
            defineField({
              name: 'temperature',
              type: 'object',
              title: 'Temperature',
              fields: [
                defineField({
                  name: 'oven',
                  type: 'number',
                  title: 'Forno (°C)',
                  validation: Rule => Rule.min(30).max(300)
                }),
                defineField({
                  name: 'ingredient',
                  type: 'string',
                  title: 'Temperatura ingredienti',
                  placeholder: 'es. burro a temperatura ambiente, latte tiepido 37°C...'
                })
              ]
            }),
            defineField({ 
              name: 'image', 
              type: 'image', 
              title: 'Immagine del passaggio', 
              options: { hotspot: true }, 
              fields: [
                { 
                  name: 'alt', 
                  type: 'string', 
                  title: 'Descrizione immagine'
                }
              ]
            }),
            defineField({
              name: 'tips',
              type: 'array',
              title: 'Consigli tecnici',
              of: [{ type: 'string' }],
              description: 'Trucchi e suggerimenti specifici per questo passaggio'
            }),
            defineField({
              name: 'commonMistakes',
              type: 'array',
              title: 'Errori comuni da evitare',
              of: [{ type: 'string' }]
            }),
            defineField({
              name: 'isCritical',
              type: 'boolean',
              title: 'Passaggio critico',
              description: 'Passaggio fondamentale per la riuscita della ricetta',
              initialValue: false
            }),
            defineField({
              name: 'visualCues',
              type: 'string',
              title: 'Segnali visivi',
              placeholder: 'es. l\'impasto deve essere liscio e omogeneo, la superficie dorata...',
              description: 'Come riconoscere quando il passaggio è completato correttamente'
            })
          ],
          preview: {
            select: {
              title: 'instruction',
              technique: 'technique',
              duration: 'duration',
              temperature: 'temperature.oven',
              media: 'image',
              isCritical: 'isCritical'
            },
            prepare({title, technique, duration, temperature, media, isCritical}) {
              const details = []
              if (duration) details.push(`${duration} min`)
              if (temperature) details.push(`${temperature}°C`)
              
              const techniqueEmojis = {
                'mixing': '🥄', 'whipping': '💨', 'tempering': '🌡️', 'kneading': '📏',
                'cooling': '❄️', 'baking': '🔥', 'resting': '⏳', 'shaping': '🎯',
                'decorating': '🎨', 'freezing': '🧊', 'other': '⚡'
              } as const;

              const emoji = technique && techniqueEmojis.hasOwnProperty(technique)
                ? techniqueEmojis[technique as keyof typeof techniqueEmojis]
                : '';
              const critical = isCritical ? '⭐ ' : '';
              const subtitle = details.length > 0 ? details.join(' • ') : '';

              return {
                title: `${critical}${emoji} ${title ? title.substring(0, 50) + (title.length > 50 ? '...' : '') : 'Passaggio vuoto'}`,
                subtitle: subtitle,
                media: media
              }
            }
          }
        }),
      ],
      validation: Rule => Rule.required().min(1).max(20),
    }),
    
    // CONSIGLI SPECIFICI PER PASTICCERIA
    defineField({
      name: 'pastryTips',
      type: 'object',
      title: 'Consigli di pasticceria',
      fields: [
        defineField({
          name: 'storage',
          type: 'object',
          title: 'Conservazione',
          fields: [
            defineField({
              name: 'room',
              type: 'string',
              title: 'A temperatura ambiente',
              placeholder: 'es. 2-3 giorni in contenitore ermetico'
            }),
            defineField({
              name: 'fridge',
              type: 'string',
              title: 'In frigorifero',
              placeholder: 'es. fino a 1 settimana, coprire con pellicola'
            }),
            defineField({
              name: 'freezer',
              type: 'string',
              title: 'Congelatore',
              placeholder: 'es. fino a 3 mesi, avvolgere in alluminio'
            })
          ]
        }),
        defineField({
          name: 'variations',
          type: 'array',
          title: 'Varianti',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  type: 'string',
                  title: 'Nome variante'
                }),
                defineField({
                  name: 'description',
                  type: 'text',
                  title: 'Descrizione'
                })
              ]
            })
          ]
        }),
        defineField({
          name: 'troubleshooting',
          type: 'array',
          title: 'Risoluzione problemi',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'problem',
                  type: 'string',
                  title: 'Problema'
                }),
                defineField({
                  name: 'solution',
                  type: 'text',
                  title: 'Soluzione'
                })
              ]
            })
          ]
        }),
        defineField({
          name: 'professionalTips',
          type: 'array',
          title: 'Segreti del mestiere',
          of: [{ type: 'string' }]
        })
      ]
    }),
    
    defineField({ name: 'author', type: 'reference', title: 'Autore', to: { type: 'author' } }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Data pubblicazione', validation: Rule => Rule.required() }),
    defineField({
      name: "seo",
      title: "Impostazioni SEO",
      type: "seo",
      group: "seo"
    }),
  ],
  groups: [
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
      difficulty: 'difficulty',
      cookTime: 'cookTime',
      ingredientsCount: 'ingredients'
    },
    prepare(selection) {
      const {author, difficulty, cookTime, ingredientsCount} = selection
      const difficultyEmojis = {
        'principiante': '⭐',
        'intermedio': '⭐⭐',
        'avanzato': '⭐⭐⭐',
        'professionale': '👨‍🍳'
      } as const;
      
      const difficultyDisplay = typeof difficulty === 'string' && difficulty in difficultyEmojis ? difficultyEmojis[difficulty as keyof typeof difficultyEmojis] : '';
      const timeDisplay = cookTime ? `${cookTime} min` : '';
      const ingredientsDisplay = Array.isArray(ingredientsCount) ? `${ingredientsCount.length} ingredienti` : '';
      
      const details = [difficultyDisplay, timeDisplay, ingredientsDisplay].filter(Boolean).join(' • ');
      
      return {
        ...selection, 
        subtitle: author ? `by ${author} • ${details}` : details
      }
    },
  }
})