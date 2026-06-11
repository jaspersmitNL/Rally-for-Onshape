export type OnshapeSelectionService = {
	constructor: {
		getCurrentSelections: () => OnshapeSelection[];
	};
};

export type OnshapeSelectionKind =
	| "face"
	| "edge"
	| "vertex"
	| "sketch"
	| "sketch-entity"
	| "body"
	| "mate-connector"
	| "feature"
	| "unknown";

export type ClassifiedOnshapeSelection = {
	// selection: OnshapeSelection;
	kind: OnshapeSelectionKind;
	id?: string;
	name?: string;
	pickLocation?: [number, number];
	planarNormal?: Record<string, number> | number[];
};

export type OnshapeSelection = {
	canContainEdge(): boolean;
	canContainFace(): boolean;
	canContainVertex(): boolean;

	changeToMeshSelection(meshData: unknown): unknown;
	checkMeshData(): unknown;
	containsMesh(): boolean;
	createBTUiSelection(): unknown;
	equals(selection: OnshapeSelection): boolean;

	getAction(): unknown;
	getAllChildSelections(): OnshapeSelection[];
	getAnnotationId(): string | undefined;
	getAnnotationType(): unknown;
	getBodyId(): string | undefined;
	getBodyMetaData(): unknown;
	getChildSelections(): OnshapeSelection[];
	getDeterministicId(value?: unknown): string;
	getDeterministicIdList(): string[];
	getEntityInferenceData(): unknown;
	getEntityMetaData(): unknown;
	getEntityName(value?: unknown): string | undefined;
	getEntityType(): number | string | undefined;
	getFeatureId(): string | undefined;
	getFeatureIds(): string[];
	getFeatureType(): string | undefined;
	getIdForCollection(): string | undefined;
	getIdString(): string;
	getInContextEntityData(): unknown;
	getInContextImports(): unknown;
	getIsPartStudioMateConnector(): boolean;
	getMateDOFType(): unknown;
	getMateType(): unknown;
	getMeshPointData(): unknown;
	getName(): string | undefined;
	getNameForSectionedEntity(value?: unknown): string | undefined;
	getOccurrence(): unknown;
	getOccurrencesFromSelection(): unknown[];
	getOwnerAssemblyOccurrence(): unknown;
	getOwnerSelectionList(): unknown;
	getPartId(): string | undefined;
	getPickIteration(): number | undefined;
	getPickLocation(): [number, number] | undefined;
	getPlanarNormal(): Record<string, number> | number[] | undefined;
	getQueryVariableName(): unknown;
	getSelectionPriority(): number | undefined;
	getSketchEntityId(): string | undefined;
	getSketchFeatureId(): string | undefined;
	getSketchGroupFeatureId(): string | undefined;
	getSketchGroupSelection(): OnshapeSelection | undefined;
	getSourcePick(): unknown;
	getSubfeatureId(): string | undefined;
	getTableRowId(): string | undefined;
	getType(): number | string | undefined;
	getUsage(): unknown;

	hasMateQueryData(): boolean;
	initializeIsFlattened(): void;

	isAnnotation(): boolean;
	isAssemblyFeature(): boolean;
	isAssemblyOccurrence(): boolean;
	isAssemblyOrigin(): boolean;
	isAssemblyPattern(): boolean;
	isAssemblySelection(): boolean;
	isAssemblySketch(): boolean;
	isAssemblySurface(): boolean;
	isAssociatedWithFeature(featureId: string): boolean;
	isBendCenterLine(): boolean;
	isBody(): boolean;
	isCircle(): boolean;
	isClosedCurve(): boolean;
	isCompositeBody(): boolean;
	isCompositeOccurrence(): boolean;
	isCone(): boolean;
	isConic(): boolean;
	isConstructionEntity(): boolean;
	isConstructionPlane(): boolean;
	isCylinder(): boolean;
	isDefaultFeature(): boolean;
	isDefinedBySMEdge(): boolean;
	isDefinedBySMFace(): boolean;
	isDefinedBySMVertex(): boolean;
	isDegenerateEdge(): boolean;
	isDerivedFeature(): boolean;
	isDerivedFeatureWithPlane(value?: unknown): boolean;
	isDimension(): boolean;
	isEdge(): boolean;
	isEdgePoint(): boolean;
	isEllipse(): boolean;
	isEntity(): boolean;
	isEquivalentInContextSelection(
		selection: OnshapeSelection,
		value?: unknown,
	): boolean;
	isEquivalentSelection(selection: OnshapeSelection, value?: unknown): boolean;
	isExplodeStep(): boolean;
	isExtruded(): boolean;
	isFace(): boolean;
	isFeature(): boolean;
	isFlattened(): boolean;
	isFlattenedOccurrence(): boolean;
	isFolder(): boolean;
	isFromActiveSheetMetal(): boolean;
	isFromBody(): boolean;
	isFromClick(): boolean;
	isFromConstructionGeometry(): boolean;
	isFromOccurrence(): boolean;
	isFromPick(): boolean;
	isFromPointBody(): boolean;
	isFromSheetBody(): boolean;
	isFromSketch(): boolean;
	isFromSolidBody(): boolean;
	isFromSplineControlPolygon(): boolean;
	isFromSplineHandle(): boolean;
	isFromWireBody(): boolean;
	isGenerativeDesignItem(): boolean;
	isGeometryMate(): boolean;
	isGeometryPoint(): boolean;
	isInContextSelection(): boolean;
	isInContextSubFeature(): boolean;
	isInternalEdge(): boolean;
	isInternalSplinePoint(): boolean;
	isLaminarEdge(): boolean;
	isLine(): boolean;
	isMate(): boolean;
	isMateConnector(): boolean;
	isMateConnectorBasedMate(): boolean;
	isMateConnectorFeature(): boolean;
	isMateGroup(): boolean;
	isMateRelation(): boolean;
	isMeshPoint(): boolean;
	isMirrorOrDerivMirroredDescendant(): boolean;
	isMirrorOrDerivedMirrorInstance(): boolean;
	isModifiable(): boolean;
	isNonGeometricItem(): boolean;
	isNonGeometricTableItem(): boolean;
	isNonModifiable(): boolean;
	isNonSolidPartOccurrence(): boolean;
	isOccurrence(): boolean;
	isParametricChildInstance(): boolean;
	isParametricInstance(): boolean;
	isParametricPartStudioChildInstance(): boolean;
	isParametricPartStudioInstance(): boolean;
	isPartOccurrence(): boolean;
	isPatternedOccurrence(): boolean;
	isPlanar(): boolean;
	isPlanarFace(): boolean;
	isPlanarFeature(): boolean;
	isPlane(): boolean;
	isProperty(): boolean;
	isQueryVariableFeature(): boolean;
	isReplicatedInstance(): boolean;
	isRevolved(): boolean;
	isRollbackBar(): boolean;
	isSectionEntity(): boolean;
	isSimulationLoad(): boolean;
	isSketchCurveType(value?: unknown): boolean;
	isSketchCurvedTextEntity(): boolean;
	isSketchFeature(): boolean;
	isSketchGroup(): boolean;
	isSketchImageEntity(): boolean;
	isSketchTextEntity(): boolean;
	isSketchTextStroke(): boolean;
	isSolveStatusFixed(): boolean;
	isSolveStatusNotConsistent(): boolean;
	isSolveStatusOverDefined(): boolean;
	isSolveStatusUnderDefined(): boolean;
	isSolveStatusUnknown(): boolean;
	isSolveStatusWellDefined(): boolean;
	isSpCurve(): boolean;
	isSphere(): boolean;
	isSpline(): boolean;
	isStandardContentOccurrence(): boolean;
	isSuppressedOccurrence(): boolean;
	isTableItem(): boolean;
	isTemporaryGeometry(): boolean;
	isTorus(): boolean;
	isUserSketchEntity(): boolean;
	isVertex(): boolean;
	isWidthMate(): boolean;

	makeBodySelection(): OnshapeSelection | undefined;
	makeCompositeBodySelections(): OnshapeSelection[] | null;
	makeMateConnectorSelection(): OnshapeSelection | undefined;
	makeOccurrenceSelection(value?: unknown): OnshapeSelection | undefined;
	makeSketchFeatureSelection(): OnshapeSelection | undefined;

	matchesSelectionFilter(filter: unknown, value?: unknown): boolean;
	mergeInContextEntityData(data: unknown): void;
	selectedFeatureHasEntities(featureId: string): boolean;

	setAction(action: unknown): void;
	setEntityInferenceData(data: unknown): void;
	setFeatureType(featureType: unknown): void;
	setFlattened(flattened: boolean): void;
	setIncontextImports(imports: unknown): void;
	setMateDOFType(type: unknown): void;
	setName(name: string): void;
	setNameFromSectionDetails(details: unknown): void;
	setOccurrence(occurrence: unknown): void;
	setOwnerSelectionList(selectionList: unknown): void;
	updateId(): void;
};
