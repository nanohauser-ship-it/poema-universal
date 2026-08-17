import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "bestiario-sala-invocacion-v1/**",
    ".arana-atlas-temp/**",
    ".bestiario-sala-temp/**",
    ".bestiario-voz-temp/**",
    ".perro-atlas-temp/**",
    ".perro-optimizado-temp/**",
    "**/*.before-*",
    "**/*.backup-*",
    "**/*.bak",
    "**/*.broken-*",
    "**/*.error-*",
    "**/*.light-backup",
    "**/*.animation-backup",
    "**/*.contaminated-*",
  ]),
]);

export default eslintConfig;
