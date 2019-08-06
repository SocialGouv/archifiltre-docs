import pick from "languages";

const english_hints = [];

const french_hints = [
  "Si vous avez fait une erreur, " +
    "vous pouvez annuler vos dernières actions en utilisant " +
    "les deux flèches « suivante » et « précédente » qui se trouvent en haut de l'interface",
  "Dans archifiltre, " +
    "chaque rectangle représente un dossier ou un fichier de votre arborescence, " +
    "leur largeur est proportionnelle au poids du dossier ou fichier, " +
    "et ils sont classés du plus grand à gauche au plus petit à droite.",
  "Dans archifiltre, " +
    "les dossiers sont en orange ou en orange foncé et " +
    "celle des fichiers dépend de leur extension.",
  "Dans archifiltre, " +
    "les tableurs sont verts, " +
    "les documents sont bleus, " +
    "les présentations (.pdf, .pptx, ...) sont rouges, " +
    "les mails (.msg, .pst, ...) sont bleu claire, " +
    "les fichiers multimédias sont en violet et " +
    "tous les autres fichiers sont en gris.",
  "Pour zoomer, double-cliquez sur un rectangle. " +
    "Pour revenir à la racine, cliquez sur le bouton « revenir à la " +
    "racine » ou double-cliquez sur le rectangle de la racine du répertoire " +
    "en cours d'analyse.",
  "Par défaut, vous êtes en mode balayage, passez votre souris " +
    "au-dessus de la visualisation pour l'explorer. " +
    "Pour verrouiller la visualisation sur un fichier ou dossier, " +
    "cliquez sur son rectangle. " +
    "Pour déverrouiller la visualisation et revenir au mode balayage, " +
    "cliquez en bas ou à droite de celle-ci.",
  "En haut de la visualisation, vous avez à gauche une fiche " +
    "qui décrit le fichier ou dossier qui se trouve sous votre souris ou qui " +
    "a été vérouillé, et à droite une section qui regroupe tous les tags de votre analyse.",
  "Vous trouverez dans la fiche à gauche une icon avec une loupe qui représente " +
    "le fichier ou dossier sélectionné. " +
    "En cliquant dessus, vous ouvrirez l'explorateur de fichier windows si c'est un dossier ou " +
    "le logiciel adéquat si c'est un fichier (ex : word pour un fichier .docx).",
  "Dans la fiche à gauche, vous pouvez renommer votre fichier ou dossier en " +
    "cliquant sur son nom, le fichier ne sera pas renommé sur votre ordinateur " +
    "et l'ancien nom sera conservé entre parenthèses dans archifiltre. " +
    "Pour redonner son nom d'origine à un fichier ou dossier, " +
    "renommer le avec une chaine de caractères vide.",
  "Vous pouvez changer le nom de votre analyse en haut au centre de l'interface. " +
    "Les fichiers générés par archifiltre porteront le nom de votre analyse.",
  "Tout en haut de l'interface il y a 3 boutons. " +
    "Le bouton « Enregistrer » permet de sauver son travail " +
    "dans un fichier JSON, vous pourrez ensuite le glisser-déposer à la " +
    "place d'un dossier dans archifiltre pour reprendre votre travail. " +
    "Le bouton « Exporter vers » vous permet d'exporter votre travail " +
    "vers divers formats (ex : CSV, ...). " +
    "Le bouton « Fermer » vous permet de fermer l'analyse en cours pour en commencer " +
    "une nouvelle.",
  "Dans la fiche à gauche, vous pourrez ajouter une description et des tags pour ajouter du " +
    "contexte et des métadonnées au dossier ou fichier sélectionné.",
  "Dans la fiche à gauche, vous trouverez une synthèse " +
    "des dates de dernières modifications " +
    "des fichiers contenus par le dossier sélectionné. " +
    "La médiane représente la date à partir de laquelle " +
    "la moitié des fichiers du dossier n'ont plus été modifiés.",
  "Lors des différents exports, les tags d'un dossier " +
    "sont propagés à tous ses fils."
];

// export const hints = pick({
//   en:english_hints,
//   fr:french_hints,
// });

export const hints = french_hints; //////////////////////
