import type {
  AtlasDocumentedRelation,
} from "./relations-types";

import {
  atlasRelations001,
} from "./atlas-relations-001";

import {
  atlasRelations002,
} from "./atlas-relations-002";

import {
  atlasRelations003,
} from "./atlas-relations-003";

import {
  atlasRelations004,
} from "./atlas-relations-004";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * REGISTRO MAESTRO DE RELACIONES
 */

export const atlasRelationsMaster:
  AtlasDocumentedRelation[] = [
    ...atlasRelations001,
    ...atlasRelations002,
    ...atlasRelations003,
    ...atlasRelations004,
  ];
