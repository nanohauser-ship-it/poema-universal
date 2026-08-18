import { galleryExperience } from "./gallery";
import { immersiveExperience } from "./immersive";
import { performanceExperience } from "./performance";
import type { ExperienceDefinition } from "../types/audiovisual";

export const experienceRegistry: Readonly<Record<string, ExperienceDefinition>> = {
  gallery: galleryExperience,
  immersive: immersiveExperience,
  performance: performanceExperience,
};

