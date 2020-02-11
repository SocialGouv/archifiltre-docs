import translations from "../../translations/translations";
import path from "path";
import { generateRandomString } from "util/random-gen-util";
import { Map } from "immutable";
import version from "version.ts";
import { getAllTagsForFile } from "../../reducers/tags/tags-selectors";
import { notifySuccess } from "../../util/notifications-util";
import { handleError } from "../../util/error-util";
import {
  METS_EXPORT_ERROR_TITLE,
  METS_EXPORT_UNHANDLED_ERROR,
  metsExportErrorCannotAccessFile,
  metsExportErrorFileDoesNotExist
} from "./mets-errors";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { getDisplayName } from "../../util/file-and-folders-utils";

const XML = require("xml");
const dateFormat = require("dateformat");
const Path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const MD5 = require("js-md5");
const uuidv4 = require("uuid/v4");

// =================================
// AUXILIARY FUNCTIONS AND VARIABLES
// =================================
const makeObj = (key, value) => ({
  [key]: value
});

const makeId = () => {
  return "_" + generateRandomString(40);
};

const DATE_FORMAT = "yyyy-mm-dd'T'HH:MM:ss";
const HASH_ALGORITHM = "MD5";

const makeCreationDate = () => {
  return dateFormat(new Date(), DATE_FORMAT);
};

// =================================
// DUMMY VALUES
// expecting them from the GUI...
// =================================
const DUMMY_PRODUCERIDENTIFIER = "ADNUM";
const DUMMY_EXCLUDE_TAG = "ignore";
const DUMMY_ARK = "ark:/12148/cbDUMMY";

// =================================
// SPECIFIC ROOT ELEMENTS
// =================================
const METS_SOURCE =
  "http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd";

const makeManifestRootAttributes = () => {
  return {
    xmlns: "http://www.loc.gov/METS/",
    "xmlns:mets": "http://www.loc.gov/METS/",
    "xmlns:premis": "info:lc/xmlns/premis-v2",
    "xmlns:link": "http://www.w3.org/1999/xlink",
    "xmlns:dc": "http://purl.org/dc/elements/1.1/",
    "xmlns:dcterms": "http://purl.org/dc/terms/",
    "xmlns:spar_dc": "http://bibnum.bnf.fr/ns/spar_dc",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation": METS_SOURCE
  };
};

/**
 * Returns a formatted METS header (metsHdr)
 * @param {string} pid productionIdentifier
 */
export const makeHeader = pid => {
  return {
    "mets:metsHdr": [
      {
        _attr: {
          ID: "HDR.1",
          CREATEDATE: makeCreationDate(),
          LASTMODDATE: makeCreationDate()
        }
      },
      makeObj("mets:altRecordID", [
        { _attr: makeObj("TYPE", "producerIdentifier") },
        DUMMY_PRODUCERIDENTIFIER
      ]),
      makeObj("mets:altRecordID", [
        { _attr: makeObj("TYPE", "productionIdentifier") },
        pid
      ])
    ]
  };
};

/**
 * Returns a formatted descriptive section (dmdSec)
 * @param {string} id identifier of the section
 * @param {Array} content a block of descriptive information in Dublin Core
 */
export const makeDmdSec = (id, content) => {
  return {
    "mets:dmdSec": [
      { _attr: makeObj("ID", id) },
      makeObj("mets:mdWrap", [
        { _attr: { MIMETYPE: "text/xml", MDTYPE: "DC" } },
        makeObj("mets:xmlData", [makeObj("spar_dc:spar_dc", content)])
      ])
    ]
  };
};

/**
 * Returns a formatted linking premis agent
 * @param {string} agentType the type of identifier
 * @param {string} agentValue the value of the identifier
 * @param {string} agentRole the role of the linking agent
 */
const makePremisAgent = (agentType, agentValue, agentRole) => {
  return {
    "premis:linkingAgentIdentifier": [
      makeObj("premis:linkingAgentIdentifierType", agentType),
      makeObj("premis:linkingAgentIdentifierValue", agentValue),
      makeObj("premis:linkingAgentRole", agentRole)
    ]
  };
};

/**
 * Returns a formatted linking premis object
 * @param {string} objectType the type of identifier
 * @param {string} objectValue the value of the identifier
 * @param {string} objectRole an optional role of the linking object
 */
const makePremisObject = (objectType, objectValue, objectRole) => {
  const loiContent = [];
  loiContent.push(makeObj("premis:linkingObjectIdentifierType", objectType));
  loiContent.push(makeObj("premis:linkingObjectIdentifierValue", objectValue));
  if (objectRole !== undefined) {
    loiContent.push(makeObj("premis:linkingObjectRole", objectRole));
  }

  return { "premis:linkingObjectIdentifier": loiContent };
};

/**
 * Returns a formatted provenance section (digiprovMD) containing a premis event
 * @param {string} id  identifier of the section
 * @param {string} type the type of the event
 * @param {Date} date the date of the event
 * @param {string} detail an optional detail for the event
 * @param {Array} agents array of linking agents, if any
 * @param {Object} object an optional linking object
 */
export const makePremisEvent = (id, type, date, detail, agents, object) => {
  const premisEvent = [];
  premisEvent.push(
    makeObj("premis:eventIdentifier", [
      makeObj("premis:eventIdentifierType", "UUID"),
      makeObj("premis:eventIdentifierValue", uuidv4())
    ])
  );
  premisEvent.push(makeObj("premis:eventType", type));
  if (date !== undefined && date !== "") {
    if (date instanceof Date) {
      const dateS = dateFormat(date, DATE_FORMAT);
      premisEvent.push(makeObj("premis:eventDateTime", dateS));
    } else {
      premisEvent.push(makeObj("premis:eventDateTime", date));
    }
  } else {
    const nowDate = dateFormat(new Date(), DATE_FORMAT);
    premisEvent.push(makeObj("premis:eventDateTime", nowDate));
  }
  if (detail !== undefined && detail !== "") {
    premisEvent.push(makeObj("premis:eventDetail", detail));
  }

  if (agents !== undefined) {
    agents.forEach(a => {
      premisEvent.push(a);
    });
  }

  if (object !== undefined) {
    premisEvent.push(object);
  }

  return {
    "mets:digiprovMD": [
      { _attr: makeObj("ID", id) },
      makeObj("mets:mdWrap", [
        { _attr: { MIMETYPE: "text/xml", MDTYPE: "PREMIS:EVENT" } },
        makeObj("mets:xmlData", [makeObj("premis:event", premisEvent)])
      ])
    ]
  };
};

/**
 * Returns a formatted file element for the fileSec section
 * @param {*} item file from the FF
 * @param {string} ID identifier of the element
 * @param {string} DMDID identifier of the related descriptive section
 * @param {string} hash md5 hash of the file
 */
export const makeFileElement = (item, ID, DMDID, hash, alias) => {
  const originalName = item.name;
  const aliasName = getDisplayName(originalName, alias);
  const internalURI = "master/" + aliasName;

  const fileContent = [];

  fileContent.push({
    _attr: {
      ID: ID,
      DMDID: DMDID,
      CHECKSUMTYPE: HASH_ALGORITHM,
      CHECKSUM: hash,
      SIZE: Math.max(item.file_size, 1)
    }
  });
  // "MIMETYPE": "DUMMY_MIMETYPE"

  fileContent.push(
    makeObj("mets:FLocat", [
      {
        _attr: {
          LOCTYPE: "URL",
          "xlink:type": "simple",
          "xlink:href": internalURI
        }
      },
      undefined // self-closed tag
    ])
  );

  return makeObj("mets:file", fileContent);
};

/**
 * Returns a formatted div element of object level for the structMap section
 * @param {*} item file from the FF
 * @param {Array} item_tags tags associated with the item
 * @param {string} ID identifien of the element
 * @param {number} order sequential order of the element
 * @param {string} FILEID identifier of the associated file element in the fileSec
 */
export const makeObjectDiv = (item, item_tags, ID, order, FILEID) => {
  /*
  item_tags.forEach(a => {
    AU_content.push(makeObj("xsi:Tag", a));
  });
  */

  return makeObj("mets:div", [
    { _attr: { ID: ID, TYPE: "object", ORDER: order } },
    makeObj("mets:fptr", [
      { _attr: { FILEID: FILEID } },
      undefined // self-closed tag
    ])
  ]);
};

/**
 * Recursive function to traverse the FF and gather METS sections
 * @param {string} filesAndFoldersId item to record
 * @param {string} rootpath relative path
 * @param {string} absolutepath absolute path
 * @param {Object} counters dictionary of counters to generate unique identifiers
 * @param {function} readFromFF function to retrieve info from the FF
 * @param {function} readTags function to retrieve the tags from the FF
 * @param {string[]} elementsToDelete the list of elements marked for deletion
 * @param {function} addToDmd function to add a descriptive section
 * @param {function} addToMASTER function to add a file section to the fileSec
 * @param {function} addToDIV function to add a div section to the structMap
 * @param {function} HMread function to read from the hashmap of the items
 * @param {function} HMupdate function to update the hashmap of the items
 * @param {function} contentWriter function to gather payload to be added to the package
 */
const recTraverseDB = (
  filesAndFoldersId,
  rootpath,
  absolutepath,
  counters,
  readFromFF,
  readTags,
  aliases,
  comments,
  elementsToDelete,
  addToDmd,
  addToMASTER,
  addToDIV,
  HMread,
  HMupdate,
  contentWriter
) => {
  const item = readFromFF(filesAndFoldersId);
  const tags = readTags(filesAndFoldersId);
  const ID = makeId();

  // Ignore files with exclude tag
  if (tags.includes(DUMMY_EXCLUDE_TAG)) {
    return;
  }

  if (elementsToDelete.includes(filesAndFoldersId)) {
    return;
  }

  if (isFile(item)) {
    // it's a file
    const cleanRootpath =
      rootpath.charAt(0) === "/" ? rootpath.substring(1) : rootpath;
    const URI = Path.join(absolutepath, cleanRootpath, item.name);
    let data;
    try {
      data = fs.readFileSync(URI);
    } catch (err) {
      handleError(
        err.code,
        {
          EACCES: metsExportErrorCannotAccessFile(URI),
          ENOENT: metsExportErrorFileDoesNotExist(URI),
          default: METS_EXPORT_UNHANDLED_ERROR
        },
        METS_EXPORT_ERROR_TITLE
      );
      return;
    }
    const hash = MD5(data);

    if (HMread().has(hash)) {
      // doublon !!!
      return;
    }

    const idFile = counters.fileCount;
    counters.fileCount = idFile + 1;

    const idDmd = counters.dmdCount;
    counters.dmdCount = idDmd + 1;
    const dmdContent = [];
    // make sure we use / in uri even on Windows
    const relativeURI = Path.join(cleanRootpath, item.name).replace(/\\/g, "/");

    dmdContent.push(
      makeObj("dc:source", [
        { _attr: { "xsi:type": "spar_dc:originalName" } },
        relativeURI
      ])
    );

    const lastModified = dateFormat(item.maxLastModified, DATE_FORMAT);
    const comment = comments[filesAndFoldersId];
    if (comment && comment.length > 0) {
      dmdContent.push(makeObj("dc:title", comment.replace(/[^\w ]/g, "_")));
    }
    dmdContent.push(makeObj("dcterms:modified", lastModified));
    addToDmd(makeDmdSec("DMD." + idDmd, dmdContent));

    const itemFile = makeFileElement(
      item,
      "master." + idFile,
      "DMD." + idDmd,
      hash,
      aliases[filesAndFoldersId]
    );
    addToMASTER(itemFile);

    const idObj = counters.objCount;
    counters.objCount = idObj + 1;

    const itemDIV = makeObjectDiv(
      item,
      tags,
      "DIV." + (idObj + 2),
      idObj,
      "master." + idFile
    );
    addToDIV(itemDIV);

    HMupdate(hash, () => ID);

    contentWriter(hash, data);
  } else {
    // it's a folder continue the traversal
    item.children.forEach(childId => {
      recTraverseDB(
        childId,
        Path.join(rootpath, item.name),
        absolutepath,
        counters,
        readFromFF,
        readTags,
        aliases,
        comments,
        elementsToDelete,
        addToDmd,
        addToMASTER,
        addToDIV,
        HMread,
        HMupdate,
        contentWriter
      );
    });
  }
};

/**
 * Returns the METS content by traversing the FF
 * @param {Object} state global state of the application
 * @param {function} contentWriter function to gather payload to be added to the package
 * @param {Array} metsContent preload METS to be filled up
 */
const makeMetsContent = (
  {
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    tags,
    originalPath,
    sessionName
  },
  contentWriter,
  metsContent
) => {
  const folderpath = path.join(originalPath, "/../");

  // Initial counters for numbering the sections
  const counters = {
    dmdCount: 2,
    amdCount: 1,
    fileCount: 1,
    objCount: 1
  };

  // Arrays to store the sections while traversing the FF
  const DMD_children = [];
  const MASTER_children = [];
  const DIV_children = [];

  MASTER_children.push({ _attr: { USE: "master", ID: "GRP.1" } });

  // Make first dmd for the group
  const dmdContent = [];
  // Need to get the item of the first folder to retrieve the title (in the comment ?)
  dmdContent.push(
    makeObj("dc:title", "DUMMMY_TITLE"),
    makeObj("dc:type", "electronic document"),
    makeObj("dc:relation", [
      { _attr: { "xsi:type": "spar_dc:ark" } },
      DUMMY_ARK
    ])
  );
  DMD_children.push(makeDmdSec("DMD.1", dmdContent));

  // Create the digiprovMD sections
  const digiprovsContent = [];
  const amdIds = [];

  // Define the event for the whole group
  // First a 'preconditioning' event
  amdIds.push("AMD.1");
  digiprovsContent.push(
    makePremisEvent(
      "AMD.1",
      "preconditioning",
      dateFormat(new Date(), DATE_FORMAT),
      undefined,
      [makePremisAgent("application", "Archifiltre v" + version, "performer")]
    )
  );
  // Skip the documentReception event ?
  // Then a 'packageCreation' event
  amdIds.push("AMD.3");
  digiprovsContent.push(
    makePremisEvent(
      "AMD.3",
      "packageCreation",
      dateFormat(new Date(), DATE_FORMAT),
      "Création d'un paquet compatible avec SPAR",
      [
        makePremisAgent("application", "Archifiltre v" + version, "performer"),
        makePremisAgent("producerIdentifier", "ADNUM", "issuer"),
        makePremisAgent(
          "channelIdentifier",
          "info:bnf/spar/context/DUMMMY_CHANNEL",
          "authorizer"
        )
      ],
      makePremisObject("productionIdentifier", sessionName)
    )
  );

  //Traversing database
  let hashmap = new Map();
  const HMread = () => hashmap;
  const HMupdate = (hash, updater) => {
    hashmap = hashmap.update(hash, updater);
  };

  const FFreader = ffId => ({
    ...filesAndFolders[ffId],
    ...filesAndFoldersMetadata[ffId]
  });
  const tagReader = ffId => getAllTagsForFile(tags, ffId).map(tag => tag.name);

  const DMDwriter = item => DMD_children.push(item);
  const MASTERwriter = item => MASTER_children.push(item);
  const DIVwriter = item => DIV_children.push(item);

  const ROOT_ID = "";

  filesAndFolders[ROOT_ID].children.forEach(ffId => {
    recTraverseDB(
      ffId,
      "",
      folderpath,
      counters,
      FFreader,
      tagReader,
      aliases,
      comments,
      elementsToDelete,
      DMDwriter,
      MASTERwriter,
      DIVwriter,
      HMread,
      HMupdate,
      contentWriter
    );
  });

  //Composition of StructMap
  const groupContent = [];
  groupContent.push({
    _attr: {
      ID: "DIV.2",
      TYPE: "group",
      DMDID: "DMD.1",
      ADMID: amdIds.join(" ")
    }
  });
  // Add all the divs at the object level
  DIV_children.forEach(div => {
    groupContent.push(div);
  });

  // Build the physical structMap
  const DIV_root = makeObj("mets:structMap", [
    { _attr: makeObj("TYPE", "physical") },
    makeObj("mets:div", [
      { _attr: { ID: "DIV.1", TYPE: "set" } },
      makeObj("mets:div", groupContent)
    ])
  ]);

  // Populate the METS
  DMD_children.forEach(dmd => {
    metsContent.push(dmd);
  });
  metsContent.push(makeObj("mets:amdSec", digiprovsContent));
  metsContent.push(
    makeObj("mets:fileSec", [makeObj("mets:fileGrp", MASTER_children)])
  );
  metsContent.push(DIV_root);
};

// =================================
// SIP COMPOSITION
// =================================
/**
 * Build the entire SIP in ZIP format with a METS manifest.
 * @param {Object} state state of the GUI
 * @param {Object} tags - The tag map of the redux store
 */
export const makeSIP = async ({
  aliases,
  comments,
  elementsToDelete,
  filesAndFolders,
  filesAndFoldersMetadata,
  tags,
  originalPath,
  sessionName
}) => {
  addTracker({
    title: ActionTitle.METS_EXPORT,
    type: ActionType.TRACK_EVENT
  });
  const sip = new JSZip();
  const content = sip.folder("master");
  const addToContent = (filename, data) => {
    content.file(filename.replace(/[^a-zA-Z0-9.\\/+=@_]+/g, "_"), data);
  };

  const metsContent = [];
  metsContent.push({ _attr: makeManifestRootAttributes() });
  metsContent.push(makeHeader(sessionName));

  makeMetsContent(
    {
      aliases,
      comments,
      elementsToDelete,
      filesAndFolders,
      filesAndFoldersMetadata,
      tags,
      originalPath,
      sessionName
    },
    addToContent,
    metsContent
  ); // will also compute ZIP

  const manifest_obj = [
    {
      "mets:mets": metsContent
    }
  ];

  const manifest_str = XML(manifest_obj, { indent: "  " });

  sip.file("manifest.xml", manifest_str);

  const exportFilePath = path.join(originalPath, "..", `${sessionName}.zip`);

  // final ZIP output
  const exportedData = await sip.generateAsync({ type: "nodebuffer" });

  const exportSuccessTitle = translations.t("export.exportSuccessTitle");
  const exportSuccessMessage = translations.t("export.exportSuccessMessage");

  fs.writeFileSync(exportFilePath, exportedData);
  notifySuccess(exportSuccessMessage, exportSuccessTitle);
};
