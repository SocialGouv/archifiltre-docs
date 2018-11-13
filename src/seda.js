import { generateRandomString } from 'random-gen'
// import { readAsText } from 'file-uti'

const XML = require('xml')
const dateFormat = require('dateformat')
const Path = require('path')
const fs = require('fs')
const SHA512 = require('js-sha512').sha512

// =================================
// AUXILIARY FUNCTIONS AND VARIABLES
// =================================
const makeObj = (key, value) => {
	let obj = {}
	obj[key] = value
	return obj
}

const pad = (s, l) => {
	let res = s.toString()
	while (res.length < l) {res = '0' + res}
	return res
}

const makeId = () => {
	return '_' + generateRandomString(40)
}

const date_format = "yyyy-mm-dd'T'HH:MM:ss"
const hash_algorithm = "SHA-512"

const seda_source = "fr:gouv:culture:archivesdefrance:seda:v2.1 seda-2.1-main.xsd"

const DUMMY_ORIGINATINGAGENCYIDENTIFIER = 'FRAN_NP_000001'
const DUMMY_ARCHIVALAGREEMENT = 'ArchivalAgreement0'
// const DUMMY_FOLDERPATH = "/home/manu/Documents/EIG/versements/Test_ADAMANT"

// =================================
// SPECIFIC ROOT ELEMENTS
// =================================
const makeManifestRootAttributes = () => {
	return {
		'xmlns': 'fr:gouv:culture:archivesdefrance:seda:v2.1',
		'xmlns:ns2': 'http://www.w3.org/1999/xlink',
		'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
		'xml:id': makeId(),
		'xsi:schemaLocation': seda_source
	}
}

const makeCodeListVersionsObj = () => {
	const codes = ['MessageDigestAlgorithm', 'MimeType', 'FileFormat', 'StorageRule', 'AppraisalRule', 'AccessRule', 'DisseminationRule', 'ReuseRule', 'ClassificationRule']
	return {CodeListVersions: codes.map(x => (makeObj(x + 'CodeListVersion', x + 'Code')))}
}

const makeArchivalAgencyObj = () => {
	return {ArchivalAgency: [makeObj('Identifier', 'DUMMY_ARCHIVALAGENCY')]}
}

const makeTransferringAgencyObj = () => {
	return {TransferringAgency: [makeObj('Identifier', 'DUMMY_TRANSFERRINGAGENCY')]}
}

// =================================
// AUXILIARY FUNCTIONS FOR DATA OBJECT PACKAGE
// =================================
const makeBDO = (item, ID, itempath, folderpath) => {
	let name_in_manifest = item.get('name').replace(/[^a-zA-Z0-9.\\-\\/+=@_]+/g, '_')


    let clean_itempath = (itempath.charAt(0) === '/' ? itempath.substring(1) : itempath)
	let URI = Path.join(folderpath, clean_itempath, item.get('name'))
	let file_hash = SHA512(fs.readFileSync(URI))
	let fake_URI = 'content/' + name_in_manifest

	let last_modified = dateFormat(item.get('last_modified_max'), date_format)

    let BDO_content = new Array()

	BDO_content.push({_attr: makeObj('id', ID)})
	BDO_content.push(makeObj('Uri', fake_URI))
	BDO_content.push(makeObj('MessageDigest', [{_attr: makeObj('algorithm', hash_algorithm)}, file_hash]))
	BDO_content.push(makeObj('Size', item.get('size')))
	BDO_content.push(makeObj('FormatIdentification', [
		makeObj('FormatLitteral', 'DUMMY_FORMATLITTERAL'),
		makeObj('MimeType', 'DUMMY_MIMETYPE'),
		makeObj('FormatId', 'DUMMY_FORMATID')
	]))
	BDO_content.push(makeObj('FileInfo', [
		makeObj('Filename', name_in_manifest),
		makeObj('LastModified', last_modified)
	]))

	return(makeObj('BinaryDataObject', BDO_content))
}

const makeFileAU = (item, item_tags, ID) => {
	let last_modified = dateFormat(item.get('last_modified_max'), date_format)
	let now = dateFormat(new Date(), date_format)

	let AU_content = new Array()

	// Where to insert alias ? Tags ? Comments ?
	AU_content.push(makeObj('DescriptionLevel', 'Item'))
	AU_content.push(makeObj('Title', item.get('name')))
	// AU_content.push(makeObj('Type', 'DUMMY_TYPE')) // CDO ?
	AU_content.push(makeObj('StartDate', last_modified)) // Correct ? Format ?
	AU_content.push(makeObj('Event', [
		makeObj('EventIdentifier', makeId()),
		makeObj('EventType', 'Creation'),
		makeObj('EventDateTime', now),
		makeObj('EventDetail', 'Créé dans ArchiFiltre.')
	]))

	if(item.get('comments').length > 0) AU_content.push(makeObj('xsi:Description', item.get('comments').replace(/[^\w ]/g, '_')))

	item_tags.forEach((a)=>{
		AU_content.push(makeObj('xsi:Tag', a))
	})


	return (makeObj('ArchiveUnit', [
		{_attr: makeObj('id', makeId())},
		// makeObj('Management', ''),
		makeObj('Content', AU_content),
		makeObj('DataObjectReference', [makeObj('DataObjectReferenceId', ID)])
	]))
}

const makeFolderAUChildren = (item, item_tags, ID) => {
	let last_modified = dateFormat(item.get('last_modified_max'), date_format)
	let now = dateFormat(new Date(), date_format)

	let AU_content = new Array()

	AU_content.push(makeObj('DescriptionLevel', 'RecordGrp'))
	AU_content.push(makeObj('Title', item.get('name')))

	if(item.get('comments').length > 0) AU_content.push(makeObj('xsi:Description', item.get('comments').replace(/[^\w ]/g, '_')))

	item_tags.forEach((a)=>{
		AU_content.push(makeObj('xsi:Tag', a))
	})

	return [
		{_attr: makeObj('id', makeId())},
		// makeObj('Management', ''),
		makeObj('Content', AU_content)
	]
}

const bundleFolderAU = (AU_children) => {
	return makeObj('ArchiveUnit', AU_children)
}

const recTraverseDB = (root, rootpath, absolutepath, readFromFF, readTags, addToDOP, addToAUParent) => {
	let item = readFromFF(root)
	let tags = readTags(root)
	let ID = makeId()

	if(item.get('children').size === 0){
		let item_BDO = makeBDO(item, ID, rootpath, absolutepath)
		let item_AU = makeFileAU(item, tags, ID)

		addToDOP(item_BDO)
		addToAUParent(item_AU)
	}
	else{
		let item_AU = makeFolderAUChildren(item, tags, ID)

		let new_hook = (child) => {item_AU.push(child); return;}

		item.get('children').forEach((child) => {
			recTraverseDB(child, Path.join(rootpath,item.get('name')), absolutepath, readFromFF, readTags, addToDOP, new_hook)
		})

		addToAUParent(bundleFolderAU(item_AU))
	}
}

// =================================
// DATA OBJECT PACKAGE
// =================================
const makeDataObjectPackageObj = (state) => {

	let FF = state.get('files_and_folders')
	let files = FF.filter(a=>a.get('children').size===0)
	let folderpath = state.get('original_path') + '/../'

	let DOP_children = new Array()
	let AU_children = new Array()

	// Pre-population of AU_children
	// Creating root elements
	let AU_root_content = new Array()
	AU_root_content.push(makeObj('DescriptionLevel', 'RecordGrp'))
	AU_root_content.push(makeObj('Title', state.get('session_name')))
	AU_root_content.push(makeObj('Event', [
		makeObj('EventIdentifier', makeId()),
		makeObj('EventType', 'Creation'),
		makeObj('EventDateTime', dateFormat(new Date(), date_format)),
		makeObj('EventDetail', 'Créé dans ArchiFiltre.')
	]))
	

	AU_children.push({_attr: makeObj('id', makeId())})
	AU_children.push(makeObj('Content', AU_root_content))

	// console.log(state.get('tags').toJS())

	//Traversing database
	const FFreader = (a) => FF.get(a)
	const tagReader = (a) => state.get('tags').filter((tag)=>tag.get('ff_ids').includes(a)).valueSeq().toList().map((a)=>a.get("name"))

	const DOPwriter = (item) => DOP_children.push(item)
	const rootAUwriter = (item) => AU_children.push(item)

	FF.filter(a=>a.get('depth')===1).forEach((ff,id)=>{
	    if (id==='') {return undefined}

		recTraverseDB(id, '', folderpath, FFreader, tagReader, DOPwriter, rootAUwriter)
	})

	//Composition of DescriptiveMetadata
	let AU_root = makeObj('ArchiveUnit', AU_children)

	//Final population of Data Object Package
	DOP_children.push(makeObj('DescriptiveMetadata', [AU_root]))
	DOP_children.push(makeObj('ManagementMetadata', [makeObj('OriginatingAgencyIdentifier', DUMMY_ORIGINATINGAGENCYIDENTIFIER)])) // DUMMY value for now

	return makeObj('DataObjectPackage', DOP_children)
}


// MANIFEST COMPOSITION
export const makeManifest = (state) => {
	let manifest_obj = [{ArchiveTransfer:
		[
			{_attr: makeManifestRootAttributes()},
			makeObj('Date', dateFormat(new Date(), date_format)),
			makeObj('MessageIdentifier', makeId()),
			makeObj('ArchivalAgreement', DUMMY_ARCHIVALAGREEMENT),
			makeCodeListVersionsObj(),
			makeDataObjectPackageObj(state),
			makeArchivalAgencyObj(),
			makeTransferringAgencyObj()
		]
	}]

	return XML(manifest_obj, {indent: '\t'})
}
	    // const alias = ff.get('alias')
	    // const comments = ff.get('comments')
	    // const tags = state.get('tags')
	    //   .filter(tag=>tag.get('ff_ids').includes(id))
	    //   .reduce((acc,val)=>acc.concat([val.get('name')]),[])