# Custom metadata ingestion

## Metadata

### Data structure

#### EntityId: `string`

#### MetadataId: `string`

#### Metadata :
- `id: MetadataId`
- `name: string`
- `entity: EntityId` : Pointe vers un `FilesAndFolders.id`
- `content: string`

#### MetadataMap : `Map<MetadataId, Metadata>`

#### EntityMetadataIndex (internal): `Map<EntityId, MetadataId[]>`
Index used to speed up metadata lookup

#### MetadataContext :
- `metadataMap: MetadataMap`
- `entityMetadataIndex: EntityMetadataIndex`


### Methods
#### addMetadata(context: MetadataContext, metadata: Metadata): MetadataContext
Add a metadata to a context
Returns a new MetadataContext with the metadata inserted

#### addMetadatas(context: MetadataContext, metadata: Metadata[]): MetadataContext
Bulk insert metadata to a context
Returns a new MetadataContext with the metadatas inserted

#### deleteMetadata(context: MetadataContext, metadataId: MetadataId): MetadataContext
Remove a metadata from a context
Returns a new MetadataContext with the metadata removed

## MetadataIngestor

### extractMetadata(csv: stream, config: { idColumn: string }): Observable<Metadata>
