"use client";

import { forwardRef } from "react";

import {
  GRAN_AVATAR_BODY_MODE,
  GRAN_AVATAR_ORGANISM_PORTRAIT,
} from "../avatarConfig";
import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarMediaConfig,
  AvatarPresenceState,
} from "../types";
import CinematicAvatarBody from "./CinematicAvatarBody";
import LiveAvatarBody from "./LiveAvatarBody";
import OrganismAvatarBody from "./OrganismAvatarBody";

type AvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

const AvatarBody = forwardRef<AvatarBodyHandle, AvatarBodyProps>(
  function AvatarBody(props, ref) {
    if (GRAN_AVATAR_BODY_MODE === "live") {
      return <LiveAvatarBody ref={ref} {...props} />;
    }

    if (GRAN_AVATAR_BODY_MODE === "organism") {
      return (
        <OrganismAvatarBody
          ref={ref}
          state={props.state}
          onLifeStateChange={props.onLifeStateChange}
          portraitUrl={GRAN_AVATAR_ORGANISM_PORTRAIT}
        />
      );
    }

    return <CinematicAvatarBody ref={ref} {...props} />;
  },
);

AvatarBody.displayName = "AvatarBody";

export type { AvatarBodyHandle } from "../types";
export default AvatarBody;
