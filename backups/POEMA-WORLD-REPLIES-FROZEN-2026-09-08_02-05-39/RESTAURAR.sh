#!/bin/bash
set -e

cd "$HOME/poema-universal"

SRC="backups/POEMA-WORLD-REPLIES-FROZEN-2026-09-08_02-05-39"
DST="app/poema-universal/presentacion-viva-v2/world/panda-poema"

for FILE in   StoryMaster.tsx   WorldReplies.tsx   JoseActorActing.tsx   JoseActor.tsx   PoemaNarrativeWorld.tsx   SceneGate.tsx   FinalePhysical.tsx   RedThread.tsx   StoryWorld.tsx   curves.ts
do
  if [ -f "$SRC/$FILE" ]; then
    cp "$SRC/$FILE" "$DST/$FILE"
  fi
done

echo "✓ WORLD REPLIES restaurado"
