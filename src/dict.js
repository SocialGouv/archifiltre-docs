const lang = navigator.language.slice(0,2)
console.log("lang : " + lang)

const dict = {
  // Home screen
  "Your data won't leave your computer. Only you can see what happens in this app.": {
    fr: "Vos données ne quittent pas votre ordinateur ; seul•e vous pouvez voir ce qui se passe dans cette application.",
    en: "Your data won't leave your computer. Only you can see what happens in this app."
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
  "Close": {
    fr: "Fermer",
    en: "Close",
  },
  "files": {
    fr: "fichiers",
    en: "files",
  },
  "folders": {
    fr: "répertoires",
    en: "folders",
  },
  "B": {
    fr: "o",
    en: "B"
  },
  "errors": {
    fr: "erreurs",
    en: "errors",
  },

  // Icicle / Types
  "Back to root": {
    fr: "Retour à la racine",
    en: "Back to root",
  },
  'Toggle Skin': {
    fr: 'changer l\'apparence',
    en: 'Toggle Skin',
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
  "Click here to add some tags!": {
    fr: "Cliquez ici pour ajouter des tags !",
    en: "Click here to add some tags!"
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


  // Tags menu
  "All tags": {
    fr: "Tous les tags",
    en: "All tags"
  },
  "No tags at the moment.": {
    fr: "Aucun tag pour l'instant.",
    en : "No tags at the moment."
  },


  // Always displayed
  "Compatible with Firefox and Chrome.": {
    fr: "Compatible avec Firefox et Chrome.",
    en: "Compatible with Firefox and Chrome.",
  },
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
