const lang = navigator.language.slice(0,-3)

const dict = {
  "Glissez-déposez un répertoire ici !": {
    fr: "Glissez-déposez un répertoire ici !",
    en: "Drop a directory here!"
  },
  "Exporter": {
  	fr: "Exporter",
  	en: "Export"
  },
  "Importer depuis un CSV": {
  	fr: "Importer depuis un CSV",
  	en: "Import from CSV"
  },
  "Fichiers chargés": {
  	fr: "Fichiers chargés",
  	en: "Files loaded"
  },
  "Erreurs": {
  	fr: "Erreurs",
  	en: "Errors"
  },
  "fichiers chargés": {
  	fr: "fichiers chargés",
  	en: "files loaded"
  },
  "erreurs": {
  	fr: "erreurs",
  	en: "errors"
  },
  "Légende": {
  	fr: "Légende",
  	en: "Legend"
  },
  "Cet outil est compatible avec Firefox et Chrome.": {
  	fr: "Cet outil est compatible avec Firefox et Chrome.",
  	en: "This software is compatible with Firefox and Chrome."
  }
}


export const tr = string => 
	(string in dict ? dict[string][lang] : string)
