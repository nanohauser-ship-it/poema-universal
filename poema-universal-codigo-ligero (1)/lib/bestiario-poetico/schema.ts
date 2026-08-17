export const creatureRevealSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "slug",
    "name",
    "lineage",
    "species",
    "symbolicCore",
    "matter",
    "element",
    "habitat",
    "gesture",
    "wound",
    "desire",
    "functionInPoem",
    "relic",
    "oracle",
    "voice",
    "visualDescription",
    "platePrompt",
    "modelingBrief"
  ],
  properties: {
    slug: {
      type: "string",
      description: "Slug ASCII en minúsculas, con guiones y sin tildes."
    },
    name: { type: "string" },
    lineage: { type: "string" },
    species: { type: "string" },
    symbolicCore: { type: "string" },
    matter: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" }
    },
    element: { type: "string" },
    habitat: { type: "string" },
    gesture: { type: "string" },
    wound: { type: "string" },
    desire: { type: "string" },
    functionInPoem: { type: "string" },
    relic: { type: "string" },
    oracle: { type: "string" },
    voice: {
      type: "object",
      additionalProperties: false,
      required: ["phrase", "tone", "addressee", "symbolicOrigin"],
      properties: {
        phrase: {
          type: "string",
          description: "Una sola frase en primera persona, íntima y necesaria, entre 10 y 32 palabras."
        },
        tone: { type: "string" },
        addressee: {
          type: "string",
          enum: ["author", "reader", "poem"]
        },
        symbolicOrigin: {
          type: "array",
          minItems: 2,
          maxItems: 5,
          items: { type: "string" }
        }
      }
    },
    visualDescription: { type: "string" },
    platePrompt: { type: "string" },
    modelingBrief: {
      type: "object",
      additionalProperties: false,
      required: [
        "silhouette",
        "surface",
        "scale",
        "rigging",
        "idleAnimation",
        "revealAnimation",
        "environment",
        "meshNotes"
      ],
      properties: {
        silhouette: { type: "string" },
        surface: { type: "string" },
        scale: { type: "string" },
        rigging: { type: "string" },
        idleAnimation: { type: "string" },
        revealAnimation: { type: "string" },
        environment: { type: "string" },
        meshNotes: {
          type: "array",
          minItems: 3,
          maxItems: 8,
          items: { type: "string" }
        }
      }
    }
  }
} as const;
