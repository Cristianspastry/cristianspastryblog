import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('recipe').title('Ricette'),
      S.documentTypeListItem('category').title('Categorie'),
      S.documentTypeListItem('author').title('Autori'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['recipe', 'category', 'author'].includes(item.getId()!),
      ),
    ])
