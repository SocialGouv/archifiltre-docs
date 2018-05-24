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
  },
  "You may also drop a JSON file previously exported from Icicle.": {
    fr: "Vous pouvez aussi déposer un fichier JSON précédement exporté depuis Stalactite.",
    en: "You may also drop a JSON file previously exported from Icicle."
  },
  "Import from CSV": {
    fr: "Importer depuis un CSV",
    en: "Import from CSV",
  },

  // Loading screen
  "Files loaded": {
    fr: "Fichiers chargés",
    en: "Files loaded",

  },
  "Errors": {
    fr: "Erreurs",
    en: "Errors",

  },

  // Dashboard
  "Export": {
    fr: "Exporter",
    en: "Export",
  },
  "Save": {
    fr: "Enregistrer",
    en: "Save"
  },
  "Errors": {
    fr: "Erreurs",
    en: "Errors",
  },
  "Reset": {
    fr: "Réinitialiser",
    en: "Reset",
  },
  "files": {
    fr: "fichiers",
    en: "files",
  },
  "B": {
    fr: "o",
    en: "B"
  },
  "errors": {
    fr: "erreurs",
    en: "errors",
  },

  // Icicle / Legend
  "Back to root": {
    fr: "Retour à la racine",
    en: "Back to root",
  },
  "Legend": {
    fr: "Légende",
    en: "Legend",
  },
  "Presentation": {
    fr: "Présentation",
    en: "Presentation",
  },
  "Folder": {
    fr: "Répertoire",
    en: "Folder",
  },
  "File": {
    fr: "Fichier",
    en: "File"
  },
  "Root": {
    fr: "Racine",
    en: "Root",
  },
  "Spreadsheet": {
    fr: "Tableur",
    en: "Spreadsheet",
  },
  "E-mail": {
    fr: "E-mail",
    en: "E-mail",
  },
  "Document": {
    fr: "Document",
    en: "Document",
  },
  "Multimedia": {
    fr: "Multimédia",
    en: "Multimedia",
  },
  "Others": {
    fr: "Autres",
    en: "Others",
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
  "Last modified" : {
    fr: "Dernière modification",
    en: "Last modified"
  },
  "at": {
    fr: "à",
    en: "at"
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
  },
  // "Your directories. Like you've never seen them before.": {
  //   fr: "Vos répertoires comme vous ne les avez jamais vus.",
  //   en: "Your directories. Like you've never seen them before."
  // },
  "Icicles": {
    fr: "Stalactites",
    en: "Icicles",
  },
  "What's new?": {
    fr: "Quoi de neuf ?",
    en: "What's new?"
  }
}


export const tr = string => 
	(string in dict ? (lang in dict[string] ? dict[string][lang] : string) : string)
