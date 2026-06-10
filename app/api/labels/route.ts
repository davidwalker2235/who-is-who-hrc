import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { caricaturesData } from "@/data/imagesData";

const FEATURES_COUNT = 7;

type LabelsMap = Record<string, number[]>;

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

function sortByNumericName(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const an = Number.parseInt(a.replace(".jpg", ""), 10);
    const bn = Number.parseInt(b.replace(".jpg", ""), 10);
    return an - bn;
  });
}

function sanitizeFeatures(features: unknown): number[] {
  if (!Array.isArray(features)) {
    return new Array(FEATURES_COUNT).fill(0);
  }

  return new Array(FEATURES_COUNT)
    .fill(0)
    .map((_, index) => (features[index] === 1 ? 1 : 0));
}

async function getJpgFiles(): Promise<string[]> {
  const caricaturesDir = path.join(process.cwd(), "public", "caricatures");
  const files = await fs.readdir(caricaturesDir);
  return sortByNumericName(
    files.filter((file) => /^\d+\.jpg$/i.test(file))
  );
}

function getCurrentLabelsAsMap(): LabelsMap {
  const map: LabelsMap = {};
  for (const item of caricaturesData) {
    map[item.file] = sanitizeFeatures(item.features);
  }
  return map;
}

function buildImagesDataFile(files: string[], labelsMap: LabelsMap): string {
  const rows = files.map((file) => {
    const features = sanitizeFeatures(labelsMap[file]);
    return `  { file: "${file}", features: [${features.join(",")}] },`;
  });

  return `${FEATURE_ENUM_BLOCK}
export const caricaturesData = [
${rows.join("\n")}
];
`;
}

export async function GET() {
  try {
    const files = await getJpgFiles();
    const labels = getCurrentLabelsAsMap();
    return NextResponse.json({ files, labels, featuresCount: FEATURES_COUNT });
  } catch (error) {
    console.error("Error loading labels:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las imágenes para etiquetar." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incomingLabels = (body?.labels ?? {}) as LabelsMap;
    const files = await getJpgFiles();

    const normalizedLabels: LabelsMap = {};
    for (const file of files) {
      normalizedLabels[file] = sanitizeFeatures(incomingLabels[file]);
    }

    const labelsJsonPath = path.join(process.cwd(), "data", "caricatureLabels.json");
    const imagesDataPath = path.join(process.cwd(), "data", "imagesData.ts");

    await fs.writeFile(labelsJsonPath, JSON.stringify(normalizedLabels, null, 2), "utf-8");
    await fs.writeFile(imagesDataPath, buildImagesDataFile(files, normalizedLabels), "utf-8");

    return NextResponse.json({ ok: true, updated: files.length });
  } catch (error) {
    console.error("Error saving labels:", error);
    return NextResponse.json(
      { error: "No se pudieron guardar las etiquetas." },
      { status: 500 }
    );
  }
}
