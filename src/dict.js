const lang = navigator.language.slice(0,-3)

const dict = {
  // Home screen
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
  "Export error log": {
    fr: "Exporter les erreurs",
    en: "Export error log",
    es: "Exportar errores"
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


    // Always displayed
  "This app is compatible with Firefox and Chrome.": {
  	fr: "Cet outil est compatible avec Firefox et Chrome.",
  	en: "This app is compatible with Firefox and Chrome.",
    es: "Esta aplicación es compatible con Firefox y Chrome."
  }
}


export const tr = string => 
	(string in dict ? (lang in dict[string] ? dict[string][lang] : string) : string)
