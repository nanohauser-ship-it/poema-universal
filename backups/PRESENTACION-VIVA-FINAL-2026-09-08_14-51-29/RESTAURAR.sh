#!/bin/bash
set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HOME/poema-universal"

DIR="$ROOT/app/poema-universal/presentacion-viva-v2"
PANDA="$DIR/world/panda-poema"

cp "$HERE/layout.tsx" "$DIR/layout.tsx"
cp "$HERE/MasterPlayer.tsx" "$DIR/MasterPlayer.tsx"

for FILE in \
  MasterTimeline.ts \
  PoemaNarrativeWorld.tsx \
  StoryMaster.tsx \
  WorldReplies.tsx \
  WorldReactivity.tsx \
  JoseActorActing.tsx \
  SceneGate.tsx \
  FinalePhysical.tsx \
  RedThread.tsx \
  curves.ts
do
  cp "$HERE/$FILE" "$PANDA/$FILE"
done

echo "✓ PRESENTACIÓN VIVA · VERSIÓN FINAL RESTAURADA"
