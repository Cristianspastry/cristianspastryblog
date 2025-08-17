




function getDifficultyRecipe(difficulty : string | undefined) {
  switch (difficulty) {
    case 'facile':
      return {
        iconColor: 'text-green-500',
        textColor: 'text-green-900',
        borderColor: 'border-green-100',
        label: 'Facile',
        description: 'Principiante'
      };
    case 'media':
      return {
        iconColor: 'text-amber-500', 
        textColor: 'text-amber-900',
        borderColor: 'border-amber-100',
        label: 'Media',
        description: 'Intermedio'
      };
    case 'difficile':
      return {
        iconColor: 'text-red-500',
        textColor: 'text-red-900', 
        borderColor: 'border-red-100',
        label: 'Difficile',
        description: 'Avanzato'
      };
    default:
      break;
  }
}

export default getDifficultyRecipe;
