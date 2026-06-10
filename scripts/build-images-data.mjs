/**
 * Regenera data/imagesData.ts a partir de public/caricatures,
 * fusionando etiquetas existentes con correcciones verificadas (vision).
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");
const tsPath = path.join(ROOT, "data", "imagesData.ts");
const caricaturesDir = path.join(ROOT, "public", "caricatures");

const FEATURE_ENUM_BLOCK = `export enum CaricatureFeatures {
  GLASSES = 0,
  BEARD = 1,
  LONG_AIR = 2,
  EARRINGS = 3,
  MAN = 4,
  PET = 5,
  GROUP = 6
}
`;

function parseExistingLabels(content) {
  const map = {};
  const re = /\{\s*file:\s*"([^"]+)",\s*features:\s*\[([\d,\s]+)\]\s*\}/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const nums = m[2].split(",").map((s) => Number.parseInt(s.trim(), 10));
    map[m[1]] = nums;
  }
  return map;
}

/** Índice 2 = pelo largo (1 sí, 0 no). Preguntas: "¿alguien en la caricatura…?" */
const verified = {
  "2.jpg": [0, 0, 1, 1, 0, 0, 0],
  "3.jpg": [1, 1, 0, 0, 1, 0, 0],
  "5.jpg": [1, 1, 0, 0, 1, 0, 1],
  "6.jpg": [0, 0, 0, 0, 1, 0, 0],
  "7.jpg": [1, 0, 0, 0, 1, 0, 0],
  "8.jpg": [0, 0, 0, 0, 1, 0, 1],
  "9.jpg": [1, 0, 1, 0, 1, 0, 1],
  "10.jpg": [0, 0, 0, 0, 1, 0, 0],
  "11.jpg": [0, 0, 0, 0, 0, 1, 0],
  "12.jpg": [1, 1, 0, 0, 1, 0, 0],
  "13.jpg": [0, 0, 0, 0, 0, 1, 0],
  "14.jpg": [0, 1, 0, 0, 1, 0, 0],
  "15.jpg": [0, 0, 1, 1, 0, 0, 0],
  "16.jpg": [1, 1, 0, 0, 1, 0, 0],
  "17.jpg": [1, 1, 0, 0, 1, 0, 0],
  "18.jpg": [1, 1, 0, 0, 1, 0, 0],
  "19.jpg": [0, 0, 0, 1, 1, 0, 1],
  "20.jpg": [0, 0, 1, 0, 0, 0, 0],
  "21.jpg": [0, 0, 1, 0, 0, 0, 0],
  "22.jpg": [1, 1, 0, 1, 1, 0, 0],
  "24.jpg": [0, 1, 0, 0, 1, 0, 0],
  "26.jpg": [1, 1, 0, 0, 1, 0, 0],
  "30.jpg": [1, 1, 1, 0, 1, 0, 0],
  "31.jpg": [0, 0, 0, 0, 1, 0, 0],
  "32.jpg": [0, 1, 0, 0, 1, 0, 0],
  "33.jpg": [0, 0, 1, 0, 0, 0, 0],
  "34.jpg": [1, 1, 0, 0, 1, 0, 0],
  "35.jpg": [1, 0, 0, 0, 1, 0, 0],
  "36.jpg": [1, 0, 0, 0, 1, 0, 0],
  "37.jpg": [1, 0, 0, 0, 1, 0, 0],
  "38.jpg": [0, 0, 1, 1, 0, 0, 0],
  "39.jpg": [1, 1, 1, 0, 1, 0, 1],
  "40.jpg": [0, 0, 1, 1, 0, 0, 1],
  "84.jpg": [0, 1, 0, 0, 1, 0, 0],
  "318.jpg": [0, 0, 1, 0, 0, 0, 0],
};

const files = fs
  .readdirSync(caricaturesDir)
  .filter((f) => /^\d+\.jpg$/i.test(f))
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

const oldContent = fs.readFileSync(tsPath, "utf8");
const previous = parseExistingLabels(oldContent);

const rows = files.map((file) => {
  const features = verified[file] ?? previous[file];
  if (!features || features.length !== 7) {
    throw new Error(`Faltan features para ${file}`);
  }
  return `  { file: "${file}", features: [${features.join(",")}] },`;
});

const out = `${FEATURE_ENUM_BLOCK}
export const caricaturesData = [
${rows.join("\n")}
];
`;

fs.writeFileSync(tsPath, out, "utf8");
console.log(`OK: ${files.length} entradas escrito en data/imagesData.ts`);
