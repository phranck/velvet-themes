import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const BUILD_SCRIPT = resolve(
  import.meta.dirname,
  "../scripts/build-registry.mjs",
);

const PALETTE = {
  canvas: "#17100d",
  foreground: "#fff2dc",
  accent: "#d97732",
  alternate: "#e9b949",
  warning: "#f0a229",
  danger: "#d84a3a",
  textPrimary: "#fff2dc",
  textSecondary: "#9e9385",
  textTertiary: "#61584f",
};

test("builds a deterministic public registry from individual theme files", async () => {
  const workspace = await mkdtemp(resolve(tmpdir(), "velvet-themes-"));
  const themesDirectory = resolve(workspace, "themes");
  const outputPath = resolve(workspace, "dist/index.json");

  try {
    await mkdir(themesDirectory, { recursive: true });
    await writeFile(
      resolve(themesDirectory, "cloudy-autumn.json"),
      `${JSON.stringify(
        {
          id: "cloudy-autumn",
          name: "Cloudy Autumn",
          author: "Velvet",
          theme: { palette: PALETTE },
        },
        null,
        2,
      )}\n`,
    );

    const result = spawnSync(
      process.execPath,
      [BUILD_SCRIPT, "--themes", themesDirectory, "--output", outputPath],
      { encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(await readFile(outputPath, "utf8")), {
      schemaVersion: 1,
      themes: [
        {
          id: "cloudy-autumn",
          name: "Cloudy Autumn",
          author: "Velvet",
          theme: { palette: PALETTE },
        },
      ],
    });
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("rejects invalid or duplicate themes before publication", async () => {
  const workspace = await mkdtemp(resolve(tmpdir(), "velvet-themes-"));
  const themesDirectory = resolve(workspace, "themes");
  const outputPath = resolve(workspace, "dist/index.json");

  try {
    await mkdir(themesDirectory, { recursive: true });
    const duplicate = {
      id: "cloudy-autumn",
      name: "Cloudy Autumn",
      theme: { palette: PALETTE },
    };
    await Promise.all([
      writeFile(
        resolve(themesDirectory, "one.json"),
        `${JSON.stringify(duplicate)}\n`,
      ),
      writeFile(
        resolve(themesDirectory, "two.json"),
        `${JSON.stringify(duplicate)}\n`,
      ),
    ]);

    const result = spawnSync(
      process.execPath,
      [BUILD_SCRIPT, "--themes", themesDirectory, "--output", outputPath],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /duplicate theme id/i);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("rejects unsupported theme fields and unsafe color sources", async () => {
  const workspace = await mkdtemp(resolve(tmpdir(), "velvet-themes-"));
  const themesDirectory = resolve(workspace, "themes");
  const outputPath = resolve(workspace, "dist/index.json");

  try {
    await mkdir(themesDirectory, { recursive: true });
    await writeFile(
      resolve(themesDirectory, "unsafe.json"),
      `${JSON.stringify({
        id: "unsafe",
        name: "Unsafe",
        theme: {
          palette: PALETTE,
          protocol: { ipv4: "javascript:alert(1)" },
          css: "body { display: none }",
        },
      })}\n`,
    );

    const result = spawnSync(
      process.execPath,
      [BUILD_SCRIPT, "--themes", themesDirectory, "--output", outputPath],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unsupported|color source/i);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("rejects out-of-range numeric controls", async () => {
  const workspace = await mkdtemp(resolve(tmpdir(), "velvet-themes-"));
  const themesDirectory = resolve(workspace, "themes");
  const outputPath = resolve(workspace, "dist/index.json");

  try {
    await mkdir(themesDirectory, { recursive: true });
    await writeFile(
      resolve(themesDirectory, "invalid-controls.json"),
      `${JSON.stringify({
        id: "invalid-controls",
        name: "Invalid Controls",
        theme: {
          palette: PALETTE,
          chart: { backgroundOpacity: 2 },
          background: { blobs: { count: 8 } },
          card: { radius: 48, maxWidth: 777 },
        },
      })}\n`,
    );

    const result = spawnSync(
      process.execPath,
      [BUILD_SCRIPT, "--themes", themesDirectory, "--output", outputPath],
      { encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /between|supported|range/i);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("publishes the four initial Velvet themes", async () => {
  const workspace = await mkdtemp(resolve(tmpdir(), "velvet-themes-"));
  const outputPath = resolve(workspace, "index.json");

  try {
    const result = spawnSync(
      process.execPath,
      [
        BUILD_SCRIPT,
        "--themes",
        resolve(import.meta.dirname, "../themes"),
        "--output",
        outputPath,
      ],
      { encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    const registry = JSON.parse(await readFile(outputPath, "utf8"));
    assert.deepEqual(
      registry.themes.map(({ id }) => id),
      ["cloudy-autumn", "sunny-spring", "velvet-default", "violet-velvet"],
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
