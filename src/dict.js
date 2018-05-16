const lang = navigator.language.slice(0,2)
console.log("lang : " + lang)

const dict = {
  // Home screen
  "Your data won't leave your computer. Only you can see what happens below.": {
    fr: "Vos données ne quittent pas votre ordinateur ; seul•e vous pouvez voir ce qu'il y a ci-dessous.",
    en: "Your data won't leave your computer. Only you can see what happens below."
  },
  "Drop a directory here!": {
    fr: "Glissez-déposez un répertoire ici !",
    en: "Drop a directory here!",
    es: "¡Coloca un directorio aquí!"
  },
  "You may also drop a CSV file previously exported from Icicle.": {
    fr: "Vous pouvez aussi déposer un fichier CSV précédement exporté depuis Stalactite.",
    en: "You may also drop a CSV file previously exported from Icicle."
  },
  "Import from CSV": {
    fr: "Importer depuis un CSV",
    en: "Import from CSV",
    es: "Importar desde un archivo CSV"
  },

  // Loading screen
  "Files loaded": {
    fr: "Fichiers chargés",
    en: "Files loaded",
    es: "Archivos cargados"
  },
  "Errors": {
    fr: "Erreurs",
    en: "Errors",
    es: "Errores"
  },

  // Icicle
  "Export": {
    fr: "Exporter",
    en: "Export",
    es: "Exportar"
  },
  "Errors": {
    fr: "Erreurs",
    en: "Errors",
    es: "Errores"
  },
  "Reset": {
    fr: "Réinitialiser",
    en: "Reset",
    es: "Reiniciar"
  },
  "files loaded": {
    fr: "fichiers chargés",
    en: "files loaded",
    es: "archivos cargados"
  },
  "errors": {
    fr: "erreurs",
    en: "errors",
    es: "errores"
  },
  "Back to root": {
    fr: "Retour à la racine",
    en: "Back to root",
  },

  // Icicle / Legend
  "Legend": {
    fr: "Légende",
    en: "Legend",
    es: "Leyenda"
  },
  "Presentation": {
    fr: "Présentation",
    en: "Presentation",
    es: "Presentación"
  },
  "Folder": {
    fr: "Répertoire",
    en: "Folder",
    es: "Directorio"
  },
  "File": {
    fr: "Fichier",
    en: "File"
  },
  "Root": {
    fr: "Racine",
    en: "Root",
    es: "Raíz"
  },
  "Spreadsheet": {
    fr: "Tableur",
    en: "Spreadsheet",
    es: "Hoja"
  },
  "E-mail": {
    fr: "E-mail",
    en: "E-mail",
    es: "E-mail"
  },
  "Document": {
    fr: "Document",
    en: "Document",
    es: "Documento"
  },
  "Multimedia": {
    fr: "Multimédia",
    en: "Multimedia",
    es: "Multimedia"
  },
  "Others": {
    fr: "Autres",
    en: "Others",
    es: "Otros"
  },
  "Level": {
    fr: "Niveau",
    en: "Level",
  },

  // Icicle / Report
  "Folder of file's name": {
    fr: "Nom du répertoire ou fichier",
    en: "Folder of file's name"
  },
  "Real name": {
    fr: "Nom réel",
    en: "Real name"
  },
  "Size": {
    fr: "Taille",
    en: "Size"
  },
  "absolute": {
    fr: "absolue",
    en: "absolute"
  },
  "percentage of the whole": {
    fr: "pourcentage du total",
    en: "percentage of the whole"
  },
  "Tags": {

  },
  "New tag": {
    fr: "Nouveau tag",
    en: "New tag"
  },
  "Comments": {
    fr: "Commentaires",
    en: "Comments"
  },
  "Your text here": {
    fr: "Votre texte ici",
    en: "Your text here"
  },
  "Your tags here": {
    fr: "Vos tags ici",
    en: "Your tags here"
  },


    // Always displayed
  "Compatible with Firefox and Chrome.": {
    fr: "Compatible avec Firefox et Chrome.",
    en: "Compatible with Firefox and Chrome.",
    es: "Compatible con Firefox y Chrome."
  },
  // "Your directories. Like you've never seen them before.": {
  //   fr: "Vos répertoires comme vous ne les avez jamais vus.",
  //   en: "Your directories. Like you've never seen them before."
  // },
  "Icicles": {
    fr: "Stalactites",
    en: "Icicles",
    es: "Carámbanos"
  },
  "What's new?": {
    fr: "Quoi de neuf ?",
    en: "What's new?"
  }
}


export const tr = string => 
	(string in dict ? (lang in dict[string] ? dict[string][lang] : string) : string)
