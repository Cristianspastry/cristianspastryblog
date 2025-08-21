import { defineField, defineType,} from "sanity";
import { SearchIcon } from "@sanity/icons";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  description: "Ottimizzazioni SEO opzionali per sovrascrivere i valori predefiniti",
  fields: [
    defineField({
      name: "title",
      title: "Titolo SEO",
      type: "string",
      description: "Se fornito, sostituirà il titolo principale. Massimo 60 caratteri consigliati",
      validation: (Rule) => Rule.max(60).warning("I titoli oltre i 60 caratteri potrebbero essere troncati nei risultati di ricerca")
    }),
    defineField({
      name: "description",
      title: "Descrizione SEO",
      type: "text",
      rows: 3,
      description: "Descrizione per i motori di ricerca. Se non specificata, userà l'excerpt della ricetta",
      validation: (Rule) => Rule.max(160).warning("Le descrizioni oltre i 160 caratteri potrebbero essere troncate")
    }),
    defineField({
      name: "image",
      title: "Immagine Social",
      type: "image",
      description: "Immagine per condivisioni social (Open Graph). Se non specificata, userà l'immagine principale della ricetta",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Testo alternativo"
        }
      ]
    }),
    defineField({
      name: "keywords",
      title: "Parole Chiave",
      type: "array",
      of: [{ type: "string" }],
      description: "Parole chiave aggiuntive per questa ricetta",
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "noIndex",
      title: "Nascondi dai Motori di Ricerca",
      type: "boolean",
      description: "Se attivato, questa pagina non apparirà nei risultati di ricerca",
      initialValue: false
    }),
    defineField({
      name: "canonicalUrl",
      title: "URL Canonico",
      type: "url",
      description: "URL canonico se questa ricetta è pubblicata altrove"
    })
  ],
  groups: [
    // ... gruppi esistenti ...
    {
      name: "seo",
      title: "SEO",
      icon: SearchIcon
    }
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      noIndex: "noIndex"
    },
    prepare({ title, description, noIndex }) {
      return {
        title: title || "SEO non personalizzato",
        subtitle: noIndex ? "🚫 Nascosto dai motori di ricerca" : description?.slice(0, 50) + "..." || "Usando valori predefiniti"
      }
    }
  }
});