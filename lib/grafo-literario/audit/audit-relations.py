from pathlib import Path
import json
import re
import sys

ROOT = Path.cwd()

AUTHORS_FILE = (
    ROOT
    / "lib/grafo-literario/atlas-authors-master.ts"
)

ONTOLOGY_FILE = (
    ROOT
    / "lib/grafo-literario/relation-ontology.ts"
)

EXTERNAL_FILE = (
    ROOT
    / "lib/grafo-literario/atlas-external-nodes-master.ts"
)

RELATION_FILES = sorted(
    p
    for p in (
        ROOT / "lib/grafo-literario"
    ).glob("atlas-relations-v4-*.ts")
    if p.name != "atlas-relations-v4.ts"
)

print("===== ATLAS · AUDITOR RELACIONAL V4 =====")
print()

# ==================================================
# AUTORES INTERNOS
# ==================================================

text = AUTHORS_FILE.read_text(
    encoding="utf-8"
)

m = re.search(
    r'export const atlasAuthorsMaster'
    r'[^=]*=\s*(\[.*\]);?\s*$',
    text,
    re.S
)

if not m:
    print("❌ No pude leer atlasAuthorsMaster.")
    sys.exit(1)

authors = json.loads(
    m.group(1)
)

author_ids = {
    a["id"]
    for a in authors
}

duplicate_author_ids = (
    len(authors)
    != len(author_ids)
)

print(
    f"Autores master: {len(authors)}"
)
print(
    f"IDs únicos:     {len(author_ids)}"
)

if duplicate_author_ids:
    print(
        "❌ Hay IDs de autor duplicados."
    )
else:
    print(
        "✅ IDs de autores únicos."
    )

# ==================================================
# ONTOLOGÍA
# ==================================================

ontology = ONTOLOGY_FILE.read_text(
    encoding="utf-8"
)

relation_match = re.search(
    r'export type AtlasRelationType'
    r'\s*=(.*?);',
    ontology,
    re.S
)

node_match = re.search(
    r'export type AtlasNodeType'
    r'\s*=(.*?);',
    ontology,
    re.S
)

if not relation_match or not node_match:
    print("❌ No pude leer la ontología.")
    sys.exit(1)

relation_types = set(
    re.findall(
        r'\|\s*"([^"]+)"',
        relation_match.group(1)
    )
)

node_types = set(
    re.findall(
        r'\|\s*"([^"]+)"',
        node_match.group(1)
    )
)

print()
print(
    f"Tipos de nodo:      {len(node_types)}"
)
print(
    f"Tipos de relación:  {len(relation_types)}"
)

# ==================================================
# NODOS EXTERNOS
# ==================================================

external_text = EXTERNAL_FILE.read_text(
    encoding="utf-8"
)

external_pairs = re.findall(
    r'["\']?type["\']?\s*:\s*"([^"]+)"\s*,\s*'
    r'["\']?id["\']?\s*:\s*"([^"]+)"',
    external_text
)

external_nodes = set(
    external_pairs
)

external_ids = {
    node_id
    for _, node_id
    in external_pairs
}

print()
print(
    f"Nodos externos:     {len(external_nodes)}"
)

external_duplicate_ids = (
    len(external_ids)
    != len(external_nodes)
)

if external_duplicate_ids:
    print(
        "❌ Hay IDs duplicados en nodos externos."
    )
else:
    print(
        "✅ IDs externos únicos."
    )

# ==================================================
# PAQUETES
# ==================================================

print()
print("Paquetes V4:")

if not RELATION_FILES:
    print("  — ninguno")
else:
    for p in RELATION_FILES:
        print(
            "  -",
            p.name
        )

file_texts = {
    p.name: p.read_text(
        encoding="utf-8"
    )
    for p in RELATION_FILES
}

relations_text = "\n".join(
    file_texts.values()
)

# ==================================================
# RELATION IDS
# ==================================================

relation_ids = re.findall(
    r'["\']?id["\']?\s*:\s*"(v4-[^"]+)"',
    relations_text
)

id_counts = {}

for rid in relation_ids:
    id_counts[rid] = (
        id_counts.get(rid, 0) + 1
    )

duplicates = sorted(
    rid
    for rid, count
    in id_counts.items()
    if count > 1
)

print()
print(
    "Relaciones V4 detectadas:",
    len(relation_ids)
)

if duplicates:
    print(
        "❌ IDs de relación duplicados:"
    )
    for x in duplicates:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Sin IDs de relación duplicados."
    )

# ==================================================
# TODAS LAS REFERENCIAS A NODOS
# ==================================================

node_refs = re.findall(
    r'["\']?type["\']?\s*:\s*"([^"]+)"\s*,\s*'
    r'["\']?id["\']?\s*:\s*"([^"]+)"',
    relations_text
)

invalid_node_types = sorted({
    node_type
    for node_type, _
    in node_refs
    if node_type not in node_types
})

if invalid_node_types:
    print()
    print(
        "❌ Tipos de nodo no definidos:"
    )
    for x in invalid_node_types:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Todos los node.type están definidos."
    )

missing_nodes = []

for node_type, node_id in node_refs:

    if (
        node_type == "author"
        and node_id in author_ids
    ):
        continue

    if (
        node_type,
        node_id
    ) in external_nodes:
        continue

    missing_nodes.append(
        (
            node_type,
            node_id
        )
    )

missing_nodes = sorted(
    set(missing_nodes)
)

print(
    "Referencias totales a nodos:",
    len(node_refs)
)

if missing_nodes:
    print()
    print(
        "❌ Nodos referenciados pero no registrados:"
    )

    for node_type, node_id in missing_nodes:
        print(
            f"   - {node_type}: {node_id}"
        )
else:
    print(
        "✅ Todas las referencias "
        "apuntan a nodos registrados."
    )

# ==================================================
# RELATION TYPES
# ==================================================

used_relation_types = set(
    re.findall(
        r'["\']?relationType["\']?\s*:\s*"([^"]+)"',
        relations_text
    )
)

invalid_relation_types = sorted(
    used_relation_types
    - relation_types
)

if invalid_relation_types:
    print()
    print(
        "❌ Tipos de relación no definidos:"
    )

    for x in invalid_relation_types:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Todos los relationType "
        "están definidos."
    )

# ==================================================
# CHUNKS DE RELACIÓN
# ==================================================

def relation_chunks(content):
    starts = list(
        re.finditer(
            r'["\']?id["\']?\s*:\s*"(v4-[^"]+)"',
            content
        )
    )

    for i, match in enumerate(starts):
        rid = match.group(1)
        start = match.start()

        if i + 1 < len(starts):
            end = starts[i + 1].start()
        else:
            end = len(content)

        yield rid, content[start:end]

# ==================================================
# EVIDENCE
# ==================================================

without_evidence = []

for content in file_texts.values():
    for rid, chunk in relation_chunks(
        content
    ):
        if not re.search(
            r'["\']?evidence["\']?\s*:',
            chunk
        ):
            without_evidence.append(
                rid
            )

if without_evidence:
    print()
    print(
        "❌ Relaciones sin evidence:"
    )

    for x in without_evidence:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Todas las relaciones incluyen evidence."
    )

# ==================================================
# CONFIDENCE
# ==================================================

without_confidence = []

for content in file_texts.values():
    for rid, chunk in relation_chunks(
        content
    ):
        if not re.search(
            r'["\']?confidence["\']?\s*:',
            chunk
        ):
            without_confidence.append(
                rid
            )

if without_confidence:
    print()
    print(
        "❌ Relaciones sin confidence:"
    )

    for x in without_confidence:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Todas las relaciones incluyen confidence."
    )

# ==================================================
# SELF RELATIONS
# ==================================================

self_relations = []

for content in file_texts.values():
    for rid, chunk in relation_chunks(
        content
    ):

        refs = re.findall(
            r'type:\s*"([^"]+)"\s*,\s*'
            r'id:\s*"([^"]+)"',
            chunk
        )

        if len(refs) >= 2:
            if refs[0] == refs[1]:
                self_relations.append(
                    rid
                )

if self_relations:
    print()
    print(
        "❌ Relaciones nodo → mismo nodo:"
    )

    for x in self_relations:
        print(
            "   -",
            x
        )
else:
    print(
        "✅ Sin relaciones nodo → mismo nodo."
    )

# ==================================================
# COBERTURA DEL CORPUS CENTRAL
# ==================================================

used_internal_authors = {
    node_id
    for node_type, node_id
    in node_refs
    if (
        node_type == "author"
        and node_id in author_ids
    )
}

isolated = sorted(
    author_ids - used_internal_authors
)

coverage = (
    len(used_internal_authors)
    / len(author_ids)
    * 100
)

print()
print(
    f"Autores internos tocados: {len(used_internal_authors)}"
)
print(
    f"Autores internos sin V4:  {len(isolated)}"
)
print(
    f"Cobertura corpus:          {coverage:.2f}%"
)

# ==================================================
# RESUMEN POR TIPO DE NODO
# ==================================================

node_type_counts = {}

for node_type, node_id in node_refs:
    node_type_counts[node_type] = (
        node_type_counts.get(
            node_type,
            0
        ) + 1
    )

print()
print("Referencias por tipo:")

for node_type in sorted(
    node_type_counts
):
    print(
        f"  {node_type}: "
        f"{node_type_counts[node_type]}"
    )

# ==================================================
# RESULTADO
# ==================================================

errors = (
    duplicate_author_ids
    or external_duplicate_ids
    or bool(duplicates)
    or bool(invalid_node_types)
    or bool(missing_nodes)
    or bool(invalid_relation_types)
    or bool(without_evidence)
    or bool(without_confidence)
    or bool(self_relations)
)

print()
print("===== RESULTADO =====")

if errors:
    print(
        "❌ AUDITORÍA CON ERRORES"
    )
    sys.exit(1)

print(
    "✅ CORPUS RELACIONAL V4 VÁLIDO"
)
print(
    f"✅ {len(relation_ids)} "
    "relaciones normalizadas"
)
print(
    f"✅ {len(used_internal_authors)} "
    "autores internos conectados"
)
print(
    f"✅ {len(external_nodes)} "
    "nodos externos registrados"
)
print(
    "✅ Integridad referencial correcta"
)
