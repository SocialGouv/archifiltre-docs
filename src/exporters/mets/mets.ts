import dateFormat from "dateformat";
import fs from "fs";
import MD5 from "js-md5";
import JSZip from "jszip";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import XML from "xml";

import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
    AliasMap,
    CommentsMap,
    FilesAndFolders,
    FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import { getAllTagsForFile } from "../../reducers/tags/tags-selectors";
import type { TagMap } from "../../reducers/tags/tags-types";
import { translations } from "../../translations/translations";
import { handleError } from "../../util/error/error-util";
import { getDisplayName } from "../../util/files-and-folders/file-and-folders-utils";
import { notifySuccess } from "../../util/notification/notifications-util";
import type { SimpleObject } from "../../util/object/object-util";
import { generateRandomString } from "../../util/random-gen-util";
import { version } from "../../version";
import {
    METS_EXPORT_ERROR_TITLE,
    METS_EXPORT_UNHANDLED_ERROR,
    metsExportErrorCannotAccessFile,
    metsExportErrorFileDoesNotExist,
} from "./mets-errors";
// =================================
// AUXILIARY FUNCTIONS AND VARIABLES
// =================================
const makeObj = (key: string, value: unknown) => ({
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
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
        xmlns: "http://www.loc.gov/METS/",
        "xmlns:dc": "http://purl.org/dc/elements/1.1/",
        "xmlns:dcterms": "http://purl.org/dc/terms/",
        "xmlns:link": "http://www.w3.org/1999/xlink",
        "xmlns:mets": "http://www.loc.gov/METS/",
        "xmlns:premis": "info:lc/xmlns/premis-v2",
        "xmlns:spar_dc": "http://bibnum.bnf.fr/ns/spar_dc",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": METS_SOURCE,
    };
    /* eslint-enable @typescript-eslint/naming-convention */
};

/**
 * Returns a formatted METS header (metsHdr)
 * @param {string} pid productionIdentifier
 */
export const makeHeader = (pid: string): SimpleObject => ({
    "mets:metsHdr": [
        {
            _attr: {
                CREATEDATE: makeCreationDate(),
                ID: "HDR.1",
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
export const makeDmdSec = (
    id: string,
    content: SimpleObject[]
): SimpleObject => {
    return {
        "mets:dmdSec": [
            { _attr: makeObj("ID", id) },
            makeObj("mets:mdWrap", [
                { _attr: { MDTYPE: "DC", MIMETYPE: "text/xml" } },
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
    const loiContent = [] as SimpleObject[];
    loiContent.push(makeObj("premis:linkingObjectIdentifierType", objectType));
    loiContent.push(
        makeObj("premis:linkingObjectIdentifierValue", objectValue)
    );
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
    date: unknown,
    detail: string | undefined,
    agents: SimpleObject[] | undefined,
    object: SimpleObject | undefined
): SimpleObject => {
    const premisEvent = [] as SimpleObject[];
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
                { _attr: { MDTYPE: "PREMIS:EVENT", MIMETYPE: "text/xml" } },
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
    item: FilesAndFolders,
    ID: string,
    DMDID: string,
    hash: string,
    alias: string
): SimpleObject => {
    const originalName = item.name;
    const aliasName = getDisplayName(originalName, alias);
    const internalURI = `master/${aliasName}`;

    const fileContent = [] as SimpleObject[];

    fileContent.push({
        _attr: {
            CHECKSUM: hash,
            CHECKSUMTYPE: HASH_ALGORITHM,
            DMDID,
            ID,
            SIZE: Math.max(item.file_size, 1),
        },
    });
    // "MIMETYPE": "DUMMY_MIMETYPE"

    fileContent.push(
        makeObj("mets:FLocat", [
            {
                _attr: {
                    LOCTYPE: "URL",
                    "xlink:href": internalURI,
                    "xlink:type": "simple",
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
    _item: FilesAndFolders,
    _itemTags: string[],
    ID: string,
    order: number,
    FILEID: string
): SimpleObject =>
    makeObj("mets:div", [
        { _attr: { ID, ORDER: order, TYPE: "object" } },
        makeObj("mets:fptr", [
            { _attr: { FILEID } },
            undefined, // self-closed tag
        ]),
    ]);

interface Counters {
    fileCount: number;
    dmdCount: number;
    objCount: number;
}

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
 * @param {function} hashMapReader function to read from the hashmap of the items
 * @param {function} hashMapUpdater function to update the hashmap of the items
 * @param {function} contentWriter function to gather payload to be added to the package
 */
const recTraverseDB = (
    filesAndFoldersId: string,
    rootPath: string,
    absolutePath: string,
    counters: Counters,
    readFromFF: (filesAndFoldersId: string) => FilesAndFolders,
    readTags: (filesAndFoldersId: string) => string[],
    aliases: AliasMap,
    comments: CommentsMap,
    elementsToDelete: string[],
    addToDmd: (object: SimpleObject) => void,
    addToMASTER: (object: SimpleObject) => void,
    addToDIV: (object: SimpleObject) => void,
    hashMapReader: () => HashesMap,
    hashMapUpdater: (
        hash: string,
        updater: (h1: string, h2: string) => string
    ) => void,
    contentWriter: (hash: string, data: Buffer) => void
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
        const cleanRootpath = rootPath.startsWith("/")
            ? rootPath.substring(1)
            : rootPath;
        const URI = path.join(absolutePath, cleanRootpath, item.name);
        let data = Buffer.from([]);
        try {
            data = fs.readFileSync(URI);
        } catch (error: unknown) {
            const err = error as { code?: string };
            if (err.code) {
                handleError(
                    err.code,
                    {
                        EACCES: metsExportErrorCannotAccessFile(URI),
                        ENOENT: metsExportErrorFileDoesNotExist(URI),
                        default: METS_EXPORT_UNHANDLED_ERROR,
                    },
                    METS_EXPORT_ERROR_TITLE
                );
            }
            return;
        }
        const hash = MD5(data);

        if (hashMapReader()[hash]) {
            // duplicate!
            return;
        }

        const idFile = counters.fileCount;
        counters.fileCount = idFile + 1;

        const idDmd = counters.dmdCount;
        counters.dmdCount = idDmd + 1;
        const dmdContent: SimpleObject[] = [];
        // make sure we use / in uri even on Windows
        const relativeURI = path
            .join(cleanRootpath, item.name)
            .replace(/\\/g, "/");

        dmdContent.push(
            makeObj("dc:source", [
                { _attr: { "xsi:type": "spar_dc:originalName" } },
                relativeURI,
            ])
        );

        const lastModified = dateFormat(item.maxLastModified, DATE_FORMAT);
        const comment = comments[filesAndFoldersId];
        if (comment && comment.length > 0) {
            dmdContent.push(
                makeObj("dc:title", comment.replace(/[^\w ]/g, "_"))
            );
        }
        dmdContent.push(makeObj("dcterms:modified", lastModified));
        addToDmd(makeDmdSec(`DMD.${idDmd}`, dmdContent));

        const itemFile = makeFileElement(
            item,
            `master.${idFile}`,
            `DMD.${idDmd}`,
            hash,
            aliases[filesAndFoldersId]
        );
        addToMASTER(itemFile);

        const idObj = counters.objCount;
        counters.objCount = idObj + 1;

        const itemDIV = makeObjectDiv(
            item,
            tags,
            `DIV.${idObj + 2}`,
            idObj,
            `master.${idFile}`
        );
        addToDIV(itemDIV);

        hashMapUpdater(hash, () => ID);

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
                hashMapReader,
                hashMapUpdater,
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
    exportPath: string;
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
    contentWriter: (hash: string, data: Buffer) => void,
    metsContent: SimpleObject[]
) => {
    const folderpath = path.join(originalPath, "/../");

    // Initial counters for numbering the sections
    const counters = {
        amdCount: 1,
        dmdCount: 2,
        fileCount: 1,
        objCount: 1,
    };

    // Arrays to store the sections while traversing the FF
    const DMDChildren: SimpleObject[] = [];
    const MASTERChildren: SimpleObject[] = [];
    const DIVChildren: SimpleObject[] = [];

    MASTERChildren.push({ _attr: { ID: "GRP.1", USE: "master" } });

    // Make first dmd for the group
    const dmdContent: SimpleObject[] = [];
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
    const digiprovsContent: SimpleObject[] = [];
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
            [
                makePremisAgent(
                    "application",
                    `Archifiltre v${version}`,
                    "performer"
                ),
            ],
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
                makePremisAgent(
                    "application",
                    `Archifiltre v${version}`,
                    "performer"
                ),
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
    const hashmap: HashesMap = {};
    const HMread = () => hashmap;
    const HMupdate = (
        hash: string,
        updater: (h1: string, h2: string) => string
    ) => {
        hashmap[hash] = updater(hashmap[hash] ?? "", hash);
    };

    const FFreader = (ffId: string) =>
        ({
            ...filesAndFolders[ffId],
            ...filesAndFoldersMetadata[ffId],
        } as FilesAndFolders);
    const tagReader = (ffId: string) =>
        getAllTagsForFile(tags, ffId).map((tag) => tag.name);

    const DMDwriter = (item: SimpleObject) => DMDChildren.push(item);
    const MASTERwriter = (item: SimpleObject) => MASTERChildren.push(item);
    const DIVwriter = (item: SimpleObject) => DIVChildren.push(item);

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
    const groupContent: SimpleObject[] = [];
    groupContent.push({
        _attr: {
            ADMID: amdIds.join(" "),
            DMDID: "DMD.1",
            ID: "DIV.2",
            TYPE: "group",
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
    exportPath,
}: GlobalState): Promise<void> => {
    const sip = new JSZip();
    const content = sip.folder("master");
    const addToContent = (filename: string, data: Buffer) => {
        content?.file(filename.replace(/[^a-zA-Z0-9.\\/+=@_]+/g, "_"), data);
    };

    const metsContent: SimpleObject[] = [];
    metsContent.push({ _attr: makeManifestRootAttributes() });
    metsContent.push(makeHeader(sessionName));

    makeMetsContent(
        {
            aliases,
            comments,
            elementsToDelete,
            exportPath,
            filesAndFolders,
            filesAndFoldersMetadata,
            originalPath,
            sessionName,
            tags,
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

    // final ZIP output
    const exportedData = await sip.generateAsync({ type: "nodebuffer" });

    const exportSuccessTitle = translations.t("export.exportSuccessTitle");
    const exportSuccessMessage = translations.t("export.exportSuccessMessage");

    fs.writeFileSync(exportPath, exportedData);
    notifySuccess(exportSuccessMessage, exportSuccessTitle);
};
