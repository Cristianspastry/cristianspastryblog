import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {recipeType} from './recipeType'
import {authorType} from './authorType'
import { seoType } from './seoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, recipeType, authorType,seoType],
}
