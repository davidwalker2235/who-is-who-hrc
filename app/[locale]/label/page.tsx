"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {useTranslations} from "next-intl";
import {trackButtonClick, trackEvent} from "@/lib/analytics";

type LabelsMap = Record<string, number[]>;

const EMPTY_FEATURES = [0, 0, 0, 0, 0, 0, 0];

export default function LabelCaricaturesPage() {
  const t = useTranslations("label");
  const [files, setFiles] = useState<string[]>([]);
  const [labels, setLabels] = useState<LabelsMap>({});
  const [index, setIndex] = useState(0);
  const [jumpTo, setJumpTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const currentFile = files[index] ?? "";
  const currentFeatures = useMemo(
    () => labels[currentFile] ?? EMPTY_FEATURES,
    [currentFile, labels]
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setStatus("");
    setStatusType(null);
    try {
      const response = await fetch("/api/labels");
      const data = await response.json();
      if (!response.ok) throw new Error(t("loadError"));

      setFiles(data.files ?? []);
      setLabels(data.labels ?? {});
      setIndex(0);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("unknownError"));
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const saveData = useCallback(async (source: "button" | "keyboard" | "unknown" = "unknown") => {
    setIsSaving(true);
    setStatus("");
    setStatusType(null);
    try {
      const response = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labels }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(t("saveError"));
      setStatus(t("savedOk", {updated: data.updated}));
      setStatusType("success");
      void trackEvent("label_save_result", {
        surface: "label_tool",
        source,
        result: "success",
        updated_count: data.updated
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t("unknownSaveError");
      setStatus(message);
      setStatusType("error");
      void trackEvent("label_save_result", {
        surface: "label_tool",
        source,
        result: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }, [labels, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!currentFile) return;

      if (event.key >= "1" && event.key <= "7") {
        const featureIndex = Number(event.key) - 1;
        const checked = currentFeatures[featureIndex] !== 1;
        void trackButtonClick(`shortcut.label.feature.${featureIndex + 1}`, {
          surface: "label_tool",
          source: "keyboard",
          file_name: currentFile,
          feature_index: featureIndex + 1,
          checked
        });
        void trackEvent("label_feature_toggle", {
          surface: "label_tool",
          source: "keyboard",
          file_name: currentFile,
          feature_index: featureIndex + 1,
          checked
        });
        setLabels((prev) => {
          const current = prev[currentFile] ?? [...EMPTY_FEATURES];
          const next = [...current];
          next[featureIndex] = next[featureIndex] === 1 ? 0 : 1;
          return { ...prev, [currentFile]: next };
        });
      }

      if (event.key.toLowerCase() === "a") {
        void trackButtonClick("shortcut.label.previous", {
          surface: "label_tool",
          source: "keyboard",
          file_name: currentFile,
          current_index: index + 1
        });
        setIndex((prev) => Math.max(0, prev - 1));
      }

      if (event.key.toLowerCase() === "d") {
        void trackButtonClick("shortcut.label.next", {
          surface: "label_tool",
          source: "keyboard",
          file_name: currentFile,
          current_index: index + 1
        });
        setIndex((prev) => Math.min(files.length - 1, prev + 1));
      }

      if (event.key.toLowerCase() === "s") {
        void trackButtonClick("shortcut.label.save", {
          surface: "label_tool",
          source: "keyboard",
          file_name: currentFile,
          current_index: index + 1
        });
        void saveData("keyboard");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentFeatures, currentFile, files.length, index, saveData]);

  const setFeatureValue = (featureIndex: number, checked: boolean) => {
    if (!currentFile) return;
    setLabels((prev) => {
      const current = prev[currentFile] ?? [...EMPTY_FEATURES];
      const next = [...current];
      next[featureIndex] = checked ? 1 : 0;
      return { ...prev, [currentFile]: next };
    });
  };

  const goToCaricature = (source: "button" | "keyboard" = "button") => {
    const target = Number.parseInt(jumpTo.trim(), 10);
    void trackButtonClick(source === "keyboard" ? "shortcut.label.goto" : "button.label.goto", {
      surface: "label_tool",
      source,
      target_index: Number.isNaN(target) ? undefined : target,
      current_index: index + 1
    });

    if (Number.isNaN(target) || target <= 0) {
      setStatus(t("invalidTarget"));
      setStatusType("error");
      void trackEvent("label_action", {
        surface: "label_tool",
        action: "goto",
        source,
        result: "invalid_target"
      });
      return;
    }

    const targetFile = `${target}.jpg`;
    const targetIndex = files.indexOf(targetFile);
    if (targetIndex === -1) {
      setStatus(t("missingTarget", {file: targetFile}));
      setStatusType("error");
      void trackEvent("label_action", {
        surface: "label_tool",
        action: "goto",
        source,
        result: "missing_target",
        target_file: targetFile
      });
      return;
    }

    setIndex(targetIndex);
    setStatus(t("positioned", {file: targetFile}));
    setStatusType("success");
    void trackEvent("label_action", {
      surface: "label_tool",
      action: "goto",
      source,
      result: "success",
      target_file: targetFile,
      target_index: targetIndex + 1
    });
  };

  const features = useMemo(
    () => [
      { index: 0, label: t("featureGlasses") },
      { index: 1, label: t("featureBeard") },
      { index: 2, label: t("featureLongHair") },
      { index: 3, label: t("featureEarrings") },
      { index: 4, label: t("featureMan") },
      { index: 5, label: t("featurePet") },
      { index: 6, label: t("featureGroup") }
    ],
    [t]
  );

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ color: "#033778", fontWeight: 700, mb: 1 }}>
        {t("title")}
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        {t("shortcuts")}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Paper sx={{ p: 2, flex: 1 }}>
          {currentFile ? (
            <>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                {t("file", {file: currentFile, current: index + 1, total: files.length})}
              </Typography>
              <Box
                component="img"
                src={`/caricatures/${currentFile}`}
                alt={currentFile}
                sx={{
                  width: "100%",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  display: "block",
                }}
              />
            </>
          ) : (
            <Typography>{t("noFiles")}</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 2, width: { xs: "100%", md: 380 } }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>{t("featuresTitle")}</Typography>
          <Stack>
            {features.map((feature) => (
              <FormControlLabel
                key={feature.index}
                control={
                  <Checkbox
                    checked={currentFeatures[feature.index] === 1}
                    onChange={(event) => {
                      void trackButtonClick(`checkbox.label.feature.${feature.index + 1}`, {
                        surface: "label_tool",
                        source: "checkbox",
                        file_name: currentFile,
                        feature_index: feature.index + 1,
                        feature_label: feature.label,
                        checked: event.target.checked
                      });
                      void trackEvent("label_feature_toggle", {
                        surface: "label_tool",
                        source: "checkbox",
                        file_name: currentFile,
                        feature_index: feature.index + 1,
                        feature_label: feature.label,
                        checked: event.target.checked
                      });
                      setFeatureValue(feature.index, event.target.checked);
                    }}
                  />
                }
                label={`${feature.index + 1}. ${feature.label}`}
              />
            ))}
          </Stack>

          <Typography sx={{ mt: 2, fontFamily: "monospace", fontSize: "0.9rem" }}>
            {`{ file: "${currentFile}", features: [${currentFeatures.join(",")}] }`}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <TextField
              size="small"
              label={t("goToLabel")}
              placeholder={t("goToPlaceholder")}
              value={jumpTo}
              onChange={(event) => setJumpTo(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  goToCaricature("keyboard");
                }
              }}
              sx={{ flex: 1 }}
            />
            <Button variant="outlined" onClick={() => goToCaricature("button")}>
              {t("goTo")}
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                void trackButtonClick("button.label.previous", {
                  surface: "label_tool",
                  source: "button",
                  file_name: currentFile,
                  current_index: index + 1
                });
                setIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={index === 0}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                void trackButtonClick("button.label.next", {
                  surface: "label_tool",
                  source: "button",
                  file_name: currentFile,
                  current_index: index + 1
                });
                setIndex((prev) => Math.min(files.length - 1, prev + 1));
              }}
              disabled={index >= files.length - 1}
            >
              {t("next")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                void trackButtonClick("button.label.save", {
                  surface: "label_tool",
                  source: "button",
                  file_name: currentFile,
                  current_index: index + 1
                });
                void saveData("button");
              }}
              disabled={isSaving}
            >
              {isSaving ? t("saving") : t("save")}
            </Button>
          </Stack>

          {status && (
            <Typography sx={{ mt: 2, color: statusType === "success" ? "success.main" : "error.main" }}>
              {status}
            </Typography>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
