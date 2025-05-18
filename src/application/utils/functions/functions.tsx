

export const formatText = (text: string , maxLength = 25) =>{
    //const maxLength = 35;
    let formatted = '';
    let index = 0;

    while (index < text.length) {
        // Découpe une section de la chaine
        let chunk = text.slice(index, index + maxLength);

        if (chunk.length === maxLength && /[a-zA-Z]/.test(chunk[maxLength - 1])) {
            // Ajoute un tiret si le dernier caractère est une lettre
            chunk += '-';
          }
      
        // Ajoute le segment formaté au résultat avec un retour à la ligne
        formatted += chunk + '\n';
    
        // Passe à la prochaine section
        index += maxLength;
    }

    return formatted.trim(); // Supprime les espaces ou retours en trop à la fin


}

export const truncateText = (input: string | undefined, maxLength: number): string => {
  if (!input) {
      return ''; // Retournez une chaîne vide si `input` est indéfini ou null
  }
  if (input.length > maxLength) {
      return input.slice(0, maxLength) + '...';
  }
  return input;
};


  