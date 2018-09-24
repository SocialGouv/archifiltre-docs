import * as XML from 'xml'

const makeManifestRootAttributes = () => {
	return {'xml:id': 'DUMMY_ID', 'xsd:schemaLocation': 'DUMMY_LOCATION'}
}

const makeDateObj = () => {
	return {Date: 'DUMMY_DATE'}
}

const makeMessageIDObj = () => {
	return {MessageIdentifier: 'DUMMY_MESSAGE_ID'}
}

const makeCodeListVersionsObj = () => {
	const codes = ['MessageDigestAlgorithm', 'MimeType', 'FileFormat', 'StorageRule', 'AppraisalRule', 'AccessRule', 'DisseminationRule', 'ReuseRule', 'ClassificationRule']
	return {CodeListVersions: codes.map(x => {(x + 'CodeListVersion'): (x + 'Code')})}
}

const makeDataObjectPackageObj = () => {
	return {DataObjectPackage: 'DUMMY_DATAOBJECTPACKAGE'}
}

const makeArchivalAgencyObj = () => {
	return {ArchivalAgency: [{Identifier: 'DUMMY_ARCHIVALAGENCY'}]}
}

const makeTransferringAgencyObj = () => {
	return {TransferringAgency: [{Identifier: 'DUMMY_TRANSFERRINGAGENCY'}]}
}

export const makeManifest = (state) => {
	let manifest_obj = [{ArchiveTransfer:
		[
			{_attr: makeManifestRootAttributes()},
			makeDateObj(),
			makeMessageIDObj(),
			makeCodeListVersionsObj(),
			makeDataObjectPackageObj(),
			makeArchivalAgencyObj(),
			makeTransferringAgencyObj()
		]
	}]

	return XML(manifest_obj)
}