import { generateRandomString } from 'random-gen'

const XML = require('xml')
const dateFormat = require('dateformat')


// AUXILIARY FUNCTIONS AND VARIABLES
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

const seda_source = "fr:gouv:culture:archivesdefrance:seda:v2.1 seda-2.1-main.xsd"

const DUMMY_ORIGINATINGAGENCYIDENTIFIER = 'FRAN_NP_000001'
const DUMMY_ARCHIVALAGREEMENT = 'ArchivalAgreement0'

// SPECIFIC ROOT ELEMENTS
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

// DATA OBJECT PACKAGE
const makeDataObjectPackageObj = (state) => {

	let files = state.get('files_and_folders').filter(a=>a.get('children').size===0)

	let DOP_children = new Array()
	let AU_children = new Array()

	// Pre-population of AU_children
	// Creating root elements
	let AU_root_content = new Array()
	AU_root_content.push(makeObj('DescriptionLevel', 'File')) // Correct?
	AU_root_content.push(makeObj('Title', 'DUMMY_TITLE')) // PUT GAME NAME HERE
	// AU_root_content.push(makeObj('CustodialHistory', [
	// 	makeObj('CustodialHistoryItem', 'DUMMY_CUSTODIALHISTORYITEM_1'),
	// 	makeObj('CustodialHistoryItem', 'DUMMY_CUSTODIALHISTORYITEM_2')
	// ]))
	AU_root_content.push(makeObj('Event', [
		makeObj('EventIdentifier', makeId()),
		makeObj('EventType', 'Creation'),
		makeObj('EventDateTime', dateFormat(new Date(), date_format)),
		makeObj('EventDetail', 'Créé dans ArchiFiltre.')
	]))
	

	AU_children.push({_attr: makeObj('id', makeId())})
	// AU_children.push(makeObj('Management', ''))
	AU_children.push(makeObj('Content', AU_root_content))


	// Populating BDO's and AU's
	files.forEach((ff,id)=>{
	    if (id==='') {return undefined}

	    let URI = (id.charAt(0) === '/' ? id.substring(1) : id)

	    let BDO_id = makeId()
		let last_modified = dateFormat(ff.get('last_modified_max'), date_format)
		let now = dateFormat(new Date(), date_format)

	    let BDO_content = new Array()

		BDO_content.push({_attr: makeObj('id', BDO_id)})
		BDO_content.push(makeObj('Uri', URI))
		// BDO_content.push(makeObj('MessageDigest', [{_attr: makeObj('algorithm', 'DUMMY_ALGORITHM')}, 'DUMMY_MESSAGEDIGEST']))
		BDO_content.push(makeObj('MessageDigest', [{_attr: makeObj('algorithm', 'DUMMY_ALGORITHM')}, '']))
		BDO_content.push(makeObj('Size', ff.get('size')))
		BDO_content.push(makeObj('FormatIdentification', [
			makeObj('FormatLitteral', 'DUMMY_FORMATLITTERAL'),
			makeObj('MimeType', 'DUMMY_MIMETYPE'),
			makeObj('FormatId', 'DUMMY_FORMATID')
		]))
		BDO_content.push(makeObj('FileInfo', [
			makeObj('Filename', ff.get('name')),
			makeObj('LastModified', last_modified) // FORMAT?
		]))

		let BDO = makeObj('BinaryDataObject', BDO_content)

		DOP_children.push(BDO)


		let AU_content = new Array()

		// Where to insert alias ? Tags ? Comments ?
		AU_content.push(makeObj('DescriptionLevel', 'File'))
		AU_content.push(makeObj('Title', ff.get('name')))
		// AU_content.push(makeObj('Type', 'DUMMY_TYPE')) // CDO ?
		AU_content.push(makeObj('StartDate', last_modified)) // Correct ? Format ?
		AU_content.push(makeObj('Event', [
			makeObj('EventIdentifier', makeId()),
			makeObj('EventType', 'Creation'),
			makeObj('EventDateTime', now),
			makeObj('EventDetail', 'Créé dans ArchiFiltre.')
		]))

		let AU = makeObj('ArchiveUnit', [
			{_attr: makeObj('id', makeId())},
			// makeObj('Management', ''),
			makeObj('Content', AU_content),
			makeObj('DataObjectReference', [makeObj('DataObjectReferenceId', BDO_id)])
		])

		AU_children.push(AU)


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

	return XML(manifest_obj)
}
	    // const path = id
	    // const size = ff.get('size')
	    // const last_modified = ff.get('last_modified_max')
	    // const alias = ff.get('alias')
	    // const comments = ff.get('comments')
	    // const tags = state.get('tags')
	    //   .filter(tag=>tag.get('ff_ids').includes(id))
	    //   .reduce((acc,val)=>acc.concat([val.get('name')]),[])