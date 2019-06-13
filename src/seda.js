import { generateRandomString } from "util/random-gen-util";
import { Map } from "immutable";

const XML = require("xml");
const dateFormat = require("dateformat");
const Path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const SHA512 = require("js-sha512").sha512;

// =================================
// AUXILIARY FUNCTIONS AND VARIABLES
// =================================
const makeObj = (key, value) => {
  let obj = {};
  obj[key] = value;
  return obj;
};

const makeId = () => {
  return "_" + generateRandomString(40);
};

const date_format = "yyyy-mm-dd'T'HH:MM:ss";
const hash_algorithm = "SHA-512";

const seda_source =
  "fr:gouv:culture:archivesdefrance:seda:v2.1 seda-2.1-main.xsd";

const DUMMY_ORIGINATINGAGENCYIDENTIFIER = "FRAN_NP_000001";
const DUMMY_ARCHIVALAGREEMENT = "ArchivalAgreement0";

// =================================
// SPECIFIC ROOT ELEMENTS
// =================================
const makeManifestRootAttributes = () => {
  return {
    xmlns: "fr:gouv:culture:archivesdefrance:seda:v2.1",
    "xmlns:ns2": "http://www.w3.org/1999/xlink",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xml:id": makeId(),
    "xsi:schemaLocation": seda_source
  };
};

const makeCodeListVersionsObj = () => {
  const codes = [
    "MessageDigestAlgorithm",
    "MimeType",
    "FileFormat",
    "StorageRule",
    "AppraisalRule",
    "AccessRule",
    "DisseminationRule",
    "ReuseRule",
    "ClassificationRule"
  ];
  return {
    CodeListVersions: codes.map(x => makeObj(x + "CodeListVersion", x + "Code"))
  };
};

const makeArchivalAgencyObj = () => {
  return { ArchivalAgency: [makeObj("Identifier", "DUMMY_ARCHIVALAGENCY")] };
};

const makeTransferringAgencyObj = () => {
  return {
    TransferringAgency: [makeObj("Identifier", "DUMMY_TRANSFERRINGAGENCY")]
  };
};

// =================================
// AUXILIARY FUNCTIONS FOR DATA OBJECT PACKAGE
// =================================
const makeBDO = (item, ID, hash) => {
  // let name_in_manifest = item.get('name').replace(/[^a-zA-Z0-9.\\-\\/+=@_]+/g, '_')
  let name_in_manifest = item.get("name");
  let fake_URI = "content/" + hash;
  let last_modified = dateFormat(item.get("last_modified_max"), date_format);

  let BDO_content = [];

  BDO_content.push({ _attr: makeObj("id", ID) });
  BDO_content.push(makeObj("Uri", fake_URI));
  BDO_content.push(
    makeObj("MessageDigest", [
      { _attr: makeObj("algorithm", hash_algorithm) },
      hash
    ])
  );
  BDO_content.push(makeObj("Size", Math.max(item.get("size"), 1)));
  // BDO_content.push(makeObj('FormatIdentification', [
  // 	makeObj('FormatLitteral', 'DUMMY_FORMATLITTERAL'),
  // 	makeObj('MimeType', 'DUMMY_MIMETYPE'),
  // 	makeObj('FormatId', 'DUMMY_FORMATID')
  // ]))
  BDO_content.push(
    makeObj("FileInfo", [
      makeObj("Filename", name_in_manifest),
      makeObj("LastModified", last_modified)
    ])
  );

  return makeObj("BinaryDataObject", BDO_content);
};

const makeFileAU = (item, item_tags, ID) => {
  let last_modified = dateFormat(item.get("last_modified_max"), date_format);
  let now = dateFormat(new Date(), date_format);

  let AU_content = [];

  // Where to insert alias ? Tags ? Comments ?
  AU_content.push(makeObj("DescriptionLevel", "Item"));
  AU_content.push(makeObj("Title", item.get("name")));
  // AU_content.push(makeObj('Type', 'DUMMY_TYPE')) // CDO ?
  AU_content.push(makeObj("StartDate", last_modified)); // Correct ? Format ?
  AU_content.push(
    makeObj("Event", [
      makeObj("EventIdentifier", makeId()),
      makeObj("EventType", "Creation"),
      makeObj("EventDateTime", now),
      makeObj("EventDetail", "Créé dans ArchiFiltre.")
    ])
  );

  if (item.get("comments").length > 0)
    AU_content.push(
      makeObj("xsi:Description", item.get("comments").replace(/[^\w ]/g, "_"))
    );

  item_tags.forEach(a => {
    AU_content.push(makeObj("xsi:Tag", a));
  });

  return makeObj("ArchiveUnit", [
    { _attr: makeObj("id", makeId()) },
    // makeObj('Management', ''),
    makeObj("Content", AU_content),
    makeObj("DataObjectReference", [makeObj("DataObjectReferenceId", ID)])
  ]);
};

const makeFolderAUChildren = (item, item_tags, ID) => {
  let last_modified = dateFormat(item.get("last_modified_max"), date_format);
  let now = dateFormat(new Date(), date_format);

  let AU_content = [];

  AU_content.push(makeObj("DescriptionLevel", "RecordGrp"));
  AU_content.push(makeObj("Title", item.get("name")));

  if (item.get("comments").length > 0)
    AU_content.push(
      makeObj("xsi:Description", item.get("comments").replace(/[^\w ]/g, "_"))
    );

  item_tags.forEach(a => {
    AU_content.push(makeObj("xsi:Tag", a));
  });

  return [
    { _attr: makeObj("id", makeId()) },
    // makeObj('Management', ''),
    makeObj("Content", AU_content)
  ];
};

const bundleFolderAU = AU_children => {
  return makeObj("ArchiveUnit", AU_children);
};

const recTraverseDB = (
  root,
  rootpath,
  absolutepath,
  readFromFF,
  readTags,
  addToDOP,
  addToAUParent,
  HMread,
  HMupdate,
  contentWriter
) => {
  let item = readFromFF(root);
  let tags = readTags(root);
  let ID = makeId();

  if (item.get("children").size === 0) {
    let clean_rootpath =
      rootpath.charAt(0) === "/" ? rootpath.substring(1) : rootpath;
    let URI = Path.join(absolutepath, clean_rootpath, item.get("name"));
    let data = fs.readFileSync(URI);
    let hash = SHA512(data);

    if (HMread().has(hash)) {
      let item_AU = makeFileAU(item, tags, HMread().get(hash));
      addToAUParent(item_AU);
    } else {
      let item_BDO = makeBDO(item, ID, hash);
      addToDOP(item_BDO);

      let item_AU = makeFileAU(item, tags, ID);
      addToAUParent(item_AU);

      HMupdate(hash, a => ID);

      contentWriter(hash, data);
    }
  } else {
    let item_AU = makeFolderAUChildren(item, tags, ID);

    let new_hook = child => {
      item_AU.push(child);
    };

    item.get("children").forEach(child => {
      recTraverseDB(
        child,
        Path.join(rootpath, item.get("name")),
        absolutepath,
        readFromFF,
        readTags,
        addToDOP,
        new_hook,
        HMread,
        HMupdate,
        contentWriter
      );
    });

    addToAUParent(bundleFolderAU(item_AU));
  }
};

// =================================
// DATA OBJECT PACKAGE
// =================================
const makeDataObjectPackageObj = (state, contentWriter) => {
  let FF = state.get("files_and_folders");
  let files = FF.filter(a => a.get("children").size === 0);
  let folderpath = state.get("original_path") + "/../";

  let DOP_children = [];
  let AU_children = [];

  // Pre-population of AU_children
  // Creating root elements
  let AU_root_content = [];
  AU_root_content.push(makeObj("DescriptionLevel", "RecordGrp"));
  AU_root_content.push(makeObj("Title", state.get("session_name")));
  AU_root_content.push(
    makeObj("Event", [
      makeObj("EventIdentifier", makeId()),
      makeObj("EventType", "Creation"),
      makeObj("EventDateTime", dateFormat(new Date(), date_format)),
      makeObj("EventDetail", "Créé dans ArchiFiltre.")
    ])
  );

  AU_children.push({ _attr: makeObj("id", makeId()) });
  AU_children.push(makeObj("Content", AU_root_content));

  // console.log(state.get('tags').toJS())

  //Traversing database
  let hashmap = new Map();
  const HMread = () => hashmap;
  const HMupdate = (hash, updater) => {
    hashmap = hashmap.update(hash, updater);
  };

  const FFreader = a => FF.get(a);
  const tagReader = a =>
    state
      .get("tags")
      .filter(tag => tag.get("ff_ids").includes(a))
      .valueSeq()
      .toList()
      .map(a => a.get("name"));

  const DOPwriter = item => DOP_children.push(item);
  const rootAUwriter = item => AU_children.push(item);

  FF.filter(a => a.get("depth") === 1).forEach((ff, id) => {
    if (id === "") {
      return undefined;
    }

    recTraverseDB(
      id,
      "",
      folderpath,
      FFreader,
      tagReader,
      DOPwriter,
      rootAUwriter,
      HMread,
      HMupdate,
      contentWriter
    );
  });

  //Composition of DescriptiveMetadata
  let AU_root = makeObj("ArchiveUnit", AU_children);

  //Final population of Data Object Package
  DOP_children.push(makeObj("DescriptiveMetadata", [AU_root]));
  DOP_children.push(
    makeObj("ManagementMetadata", [
      makeObj("OriginatingAgencyIdentifier", DUMMY_ORIGINATINGAGENCYIDENTIFIER)
    ])
  ); // DUMMY value for now

  return makeObj("DataObjectPackage", DOP_children);
};

// =================================
// SIP COMPOSITION
// =================================
export const makeSIP = state => {
  let sip = new JSZip();

  let content = sip.folder("content");
  let addToContent = (filename, data) => {
    content.file(filename.replace(/[^a-zA-Z0-9.\\-\\/+=@_]+/g, "_"), data);
  };

  let DOP_obj = makeDataObjectPackageObj(state, addToContent); // will also compute ZIP

  let manifest_obj = [
    {
      ArchiveTransfer: [
        { _attr: makeManifestRootAttributes() },
        makeObj("Date", dateFormat(new Date(), date_format)),
        makeObj("MessageIdentifier", makeId()),
        makeObj("ArchivalAgreement", DUMMY_ARCHIVALAGREEMENT),
        makeCodeListVersionsObj(),
        DOP_obj,
        makeArchivalAgencyObj(),
        makeTransferringAgencyObj()
      ]
    }
  ];

  let manifest_str = XML(manifest_obj, { indent: "\t" });

  sip.file("manifest.xml", manifest_str);

  // final ZIP output
  sip.generateAsync({ type: "nodebuffer" }).then(data => {
    fs.writeFileSync(
      state.get("original_path") + "/../" + state.get("session_name") + ".zip",
      data
    );
    console.log("SIP zip written.");
  });
};
