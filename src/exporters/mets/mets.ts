import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import translations from "translations/translations";
import path from "path";
import { generateRandomString } from "util/random-gen-util";
import { Map } from "immutable";
import { getAllTagsForFile } from "reducers/tags/tags-selectors";
import version from "version";
import { notifySuccess } from "util/notification/notifications-util";
import { handleError } from "util/error/error-util";
import {
  METS_EXPORT_ERROR_TITLE,
  METS_EXPORT_UNHANDLED_ERROR,
  metsExportErrorCannotAccessFile,
  metsExportErrorFileDoesNotExist,
} from "./mets-errors";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { getDisplayName } from "util/files-and-folders/file-and-folders-utils";
import { v4 as uuidv4 } from "uuid";

import MD5 from "js-md5";
import XML from "xml";
import dateFormat from "dateformat";
import fs from "fs";
import JSZip from "jszip";
// =================================
// AUXILIARY FUNCTIONS AND VARIABLES
// =================================
const makeObj = (key: string, value: any) => ({
  [key]: value,
});

const makeId = () => {
  return `_${generateRandomString(40)}`;
};

const DATE_FORMAT = "yyyy-mm-dd'T'HH:MM:ss";
const HASH_ALGORITHM = "MD5";

const makeCreationDate = () => dateFormat(new Date(), DATE_FORMAT);

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
    "xsi:schemaLocation": METS_SOURCE,
  };
};

/**
 * Returns a formatted METS header (metsHdr)
 * @param {string} pid productionIdentifier
 */
export const makeHeader = (pid: string) => ({
  "mets:metsHdr": [
    {
      _attr: {
        ID: "HDR.1",
        CREATEDATE: makeCreationDate(),
        LASTMODDATE: makeCreationDate(),
      },
    },
    makeObj("mets:altRecordID", [
      { _attr: makeObj("TYPE", "producerIdentifier") },
      DUMMY_PRODUCERIDENTIFIER,
    ]),
    makeObj("mets:altRecordID", [
      { _attr: makeObj("TYPE", "productionIdentifier") },
      pid,
    ]),
  ],
});

/**
 * Returns a formatted descriptive section (dmdSec)
 * @param {string} id identifier of the section
 * @param {Array} content a block of descriptive information in Dublin Core
 */
export const makeDmdSec = (id: string, content: object[]) => {
  return {
    "mets:dmdSec": [
      { _attr: makeObj("ID", id) },
      makeObj("mets:mdWrap", [
        { _attr: { MIMETYPE: "text/xml", MDTYPE: "DC" } },
        makeObj("mets:xmlData", [makeObj("spar_dc:spar_dc", content)]),
      ]),
    ],
  };
};

/**
 * Returns a formatted linking premis agent
 * @param {string} agentType the type of identifier
 * @param {string} agentValue the value of the identifier
 * @param {string} agentRole the role of the linking agent
 */
const makePremisAgent = (
  agentType: string,
  agentValue: string,
  agentRole: string
) => {
  return {
    "premis:linkingAgentIdentifier": [
      makeObj("premis:linkingAgentIdentifierType", agentType),
      makeObj("premis:linkingAgentIdentifierValue", agentValue),
      makeObj("premis:linkingAgentRole", agentRole),
    ],
  };
};

/**
 * Returns a formatted linking premis object
 * @param {string} objectType the type of identifier
 * @param {string} objectValue the value of the identifier
 * @param {string} objectRole an optional role of the linking object
 */
const makePremisObject = (
  objectType: string,
  objectValue: string,
  objectRole: string | undefined
) => {
  const loiContent = [] as object[];
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
export const makePremisEvent = (
  id: string,
  type: string,
  date: any,
  detail: string | undefined,
  agents: object[] | undefined,
  object: object | undefined
) => {
  const premisEvent = [] as object[];
  premisEvent.push(
    makeObj("premis:eventIdentifier", [
      makeObj("premis:eventIdentifierType", "UUID"),
      makeObj("premis:eventIdentifierValue", uuidv4()),
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
    agents.forEach((agent) => {
      premisEvent.push(agent);
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
        makeObj("mets:xmlData", [makeObj("premis:event", premisEvent)]),
      ]),
    ],
  };
};

/**
 * Returns a formatted file element for the fileSec section
 * @param {*} item file from the FF
 * @param {string} ID identifier of the element
 * @param {string} DMDID identifier of the related descriptive section
 * @param {string} hash md5 hash of the file
 * @param {string} alias of the file
 */
export const makeFileElement = (
  item: any,
  ID: string,
  DMDID: string,
  hash: string,
  alias: string
) => {
  const originalName = item.name;
  const aliasName = getDisplayName(originalName, alias);
  const internalURI = `master/${aliasName}`;

  const fileContent = [] as object[];

  fileContent.push({
    _attr: {
      ID,
      DMDID,
      CHECKSUMTYPE: HASH_ALGORITHM,
      CHECKSUM: hash,
      SIZE: Math.max(item.file_size, 1),
    },
  });
  // "MIMETYPE": "DUMMY_MIMETYPE"

  fileContent.push(
    makeObj("mets:FLocat", [
      {
        _attr: {
          LOCTYPE: "URL",
          "xlink:type": "simple",
          "xlink:href": internalURI,
        },
      },
      undefined, // self-closed tag
    ])
  );

  return makeObj("mets:file", fileContent);
};

/**
 * Returns a formatted div element of object level for the structMap section
 * @param {*} item file from the FF
 * @param {Array} itemTags is an array of tags
 * @param {string} ID identifien of the element
 * @param {number} order sequential order of the element
 * @param {string} FILEID identifier of the associated file element in the fileSec
 */
export const makeObjectDiv = (
  item: any,
  itemTags: any,
  ID: string,
  order: number,
  FILEID: string
) =>
  makeObj("mets:div", [
    { _attr: { ID, TYPE: "object", ORDER: order } },
    makeObj("mets:fptr", [
      { _attr: { FILEID } },
      undefined, // self-closed tag
    ]),
  ]);

/**
 * Recursive function to traverse the FF and gather METS sections
 * @param {string} filesAndFoldersId item to record
 * @param {string} rootPath relative path
 * @param {string} absolutePath absolute path
 * @param {Object} counters dictionary of counters to generate unique identifiers
 * @param {function} readFromFF function to retrieve info from the FF
 * @param {function} readTags function to retrieve the tags from the FF
 * @param {AliasMap} aliases is a map of aliases
 * @param {CommentsMap} comments is a map of comments
 * @param {string[]} elementsToDelete the list of elements marked for deletion
 * @param {function} addToDmd function to add a descriptive section
 * @param {function} addToMASTER function to add a file section to the fileSec
 * @param {function} addToDIV function to add a div section to the structMap
 * @param {function} HMRead function to read from the hashmap of the items
 * @param {function} HMUpdate function to update the hashmap of the items
 * @param {function} contentWriter function to gather payload to be added to the package
 */
const recTraverseDB = (
  filesAndFoldersId: string,
  rootPath: string,
  absolutePath: string,
  counters: any,
  readFromFF: (filesAndFoldersId: string) => any,
  readTags: (filesAndFoldersId: string) => any,
  aliases: AliasMap,
  comments: CommentsMap,
  elementsToDelete: string[],
  addToDmd: (object: any) => void,
  addToMASTER: (object: any) => void,
  addToDIV: (object: any) => void,
  HMRead: () => any,
  HMUpdate: (hash: string, id: any) => void,
  contentWriter: (hash: string, data: object) => void
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
      rootPath.charAt(0) === "/" ? rootPath.substring(1) : rootPath;
    const URI = path.join(absolutePath, cleanRootpath, item.name);
    let data;
    try {
      data = fs.readFileSync(URI);
    } catch (error) {
      handleError(
        error.code,
        {
          EACCES: metsExportErrorCannotAccessFile(URI),
          ENOENT: metsExportErrorFileDoesNotExist(URI),
          default: METS_EXPORT_UNHANDLED_ERROR,
        },
        METS_EXPORT_ERROR_TITLE
      );
      return;
    }
    const hash = MD5(data);

    if (HMRead().has(hash)) {
      // duplicate!
      return;
    }

    const idFile = counters.fileCount;
    counters.fileCount = idFile + 1;

    const idDmd = counters.dmdCount;
    counters.dmdCount = idDmd + 1;
    const dmdContent = [] as object[];
    // make sure we use / in uri even on Windows
    const relativeURI = path.join(cleanRootpath, item.name).replace(/\\/g, "/");

    dmdContent.push(
      makeObj("dc:source", [
        { _attr: { "xsi:type": "spar_dc:originalName" } },
        relativeURI,
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

    HMUpdate(hash, () => ID);

    contentWriter(hash, data);
  } else {
    // it's a folder continue the traversal
    item.children.forEach((childId) => {
      recTraverseDB(
        childId,
        path.join(rootPath, item.name),
        absolutePath,
        counters,
        readFromFF,
        readTags,
        aliases,
        comments,
        elementsToDelete,
        addToDmd,
        addToMASTER,
        addToDIV,
        HMRead,
        HMUpdate,
        contentWriter
      );
    });
  }
};

interface GlobalState {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  tags: TagMap;
  originalPath: string;
  sessionName: string;
}

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
    sessionName,
  }: GlobalState,
  contentWriter: (hash: string, data: object) => void,
  metsContent: object[]
) => {
  const folderpath = path.join(originalPath, "/../");

  // Initial counters for numbering the sections
  const counters = {
    dmdCount: 2,
    amdCount: 1,
    fileCount: 1,
    objCount: 1,
  };

  // Arrays to store the sections while traversing the FF
  const DMDChildren = [] as object[];
  const MASTERChildren = [] as object[];
  const DIVChildren = [] as object[];

  MASTERChildren.push({ _attr: { USE: "master", ID: "GRP.1" } });

  // Make first dmd for the group
  const dmdContent = [] as object[];
  // Need to get the item of the first folder to retrieve the title (in the comment ?)
  dmdContent.push(
    makeObj("dc:title", "DUMMMY_TITLE"),
    makeObj("dc:type", "electronic document"),
    makeObj("dc:relation", [
      { _attr: { "xsi:type": "spar_dc:ark" } },
      DUMMY_ARK,
    ])
  );
  DMDChildren.push(makeDmdSec("DMD.1", dmdContent));

  // Create the digiprovMD sections
  const digiprovsContent = [] as object[];
  const amdIds = [] as string[];

  // Define the event for the whole group
  // First a 'preconditioning' event
  amdIds.push("AMD.1");
  digiprovsContent.push(
    makePremisEvent(
      "AMD.1",
      "preconditioning",
      dateFormat(new Date(), DATE_FORMAT),
      undefined,
      [makePremisAgent("application", "Archifiltre v" + version, "performer")],
      undefined
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
        ),
      ],
      makePremisObject("productionIdentifier", sessionName, undefined)
    )
  );

  // Traversing database
  let hashmap = Map();
  const HMread = () => hashmap;
  const HMupdate = (hash, updater) => {
    hashmap = hashmap.update(hash, updater);
  };

  const FFreader = (ffId) => ({
    ...filesAndFolders[ffId],
    ...filesAndFoldersMetadata[ffId],
  });
  const tagReader = (ffId) =>
    getAllTagsForFile(tags, ffId).map((tag) => tag.name);

  const DMDwriter = (item) => DMDChildren.push(item);
  const MASTERwriter = (item) => MASTERChildren.push(item);
  const DIVwriter = (item) => DIVChildren.push(item);

  const ROOT_ID = "";

  filesAndFolders[ROOT_ID].children.forEach((ffId) => {
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

  // Composition of StructMap
  const groupContent = [] as object[];
  groupContent.push({
    _attr: {
      ID: "DIV.2",
      TYPE: "group",
      DMDID: "DMD.1",
      ADMID: amdIds.join(" "),
    },
  });
  // Add all the divs at the object level
  DIVChildren.forEach((div) => {
    groupContent.push(div);
  });

  // Build the physical structMap
  const divRoot = makeObj("mets:structMap", [
    { _attr: makeObj("TYPE", "physical") },
    makeObj("mets:div", [
      { _attr: { ID: "DIV.1", TYPE: "set" } },
      makeObj("mets:div", groupContent),
    ]),
  ]);

  // Populate the METS
  DMDChildren.forEach((dmd) => {
    metsContent.push(dmd);
  });
  metsContent.push(makeObj("mets:amdSec", digiprovsContent));
  metsContent.push(
    makeObj("mets:fileSec", [makeObj("mets:fileGrp", MASTERChildren)])
  );
  metsContent.push(divRoot);
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
  sessionName,
}: GlobalState) => {
  addTracker({
    title: ActionTitle.METS_EXPORT,
    type: ActionType.TRACK_EVENT,
  });
  const sip = new JSZip();
  const content = sip.folder("master");
  const addToContent = (filename, data) => {
    content?.file(filename.replace(/[^a-zA-Z0-9.\\/+=@_]+/g, "_"), data);
  };

  const metsContent = [] as object[];
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
      sessionName,
    },
    addToContent,
    metsContent
  ); // will also compute ZIP

  const manifestObj = [
    {
      "mets:mets": metsContent,
    },
  ];

  const manifestStr = XML(manifestObj, { indent: "  " });

  sip.file("manifest.xml", manifestStr);

  const exportFilePath = path.join(originalPath, "..", `${sessionName}.zip`);

  // final ZIP output
  const exportedData = await sip.generateAsync({ type: "nodebuffer" });

  const exportSuccessTitle = translations.t("export.exportSuccessTitle");
  const exportSuccessMessage = translations.t("export.exportSuccessMessage");

  fs.writeFileSync(exportFilePath, exportedData);
  notifySuccess(exportSuccessMessage, exportSuccessTitle);
};
