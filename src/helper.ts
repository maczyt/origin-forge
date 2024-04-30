import { vol } from "memfs";
import fs from "fs-extra";
import { Transform } from "stream";
import type { IDirent } from "memfs/lib/node/types/misc";
import path from "path";
import { compile } from "handlebars";

const templatePath = path.resolve(__dirname, "../templates");

const mkdirRecursive = async (target: string) => {
  try {
    await vol.promises.mkdir(target, { recursive: true });
  } catch (error) {}
};
async function copy(from: string, to: string, data: any) {
  await mkdirRecursive(to);
  const entries = await (fs.promises.readdir(from, {
    withFileTypes: true,
  }) as unknown as Promise<IDirent[]>);
  for (const entry of entries) {
    const name = entry.name.toString();
    const sourcePath = path.join(from, name);
    const targetPath = path.join(to, name);
    if (entry.isDirectory()) {
      await copy(sourcePath, targetPath, data);
    } else {
      await copyFile(sourcePath, targetPath, data);
    }
  }
}

async function copyFile(source: string, target: string, data: any) {
  const read = fs.createReadStream(source);
  class RenderDataTransform extends Transform {
    _transform(chunk: any, _: any, callback: any) {
      const content = chunk.toString();
      const template = compile(content);
      const result = template(data || {});
      this.push(result);
      callback();
    }
  }

  const write = vol.createWriteStream(target);
  await new Promise((resolve) => {
    read.pipe(new RenderDataTransform()).pipe(write);
    write.once("finish", resolve);
  });
}

export const copyDir = async (temp: string, data: any) => {
  await copy(path.join(templatePath, "library"), temp, data);
};

export const writeToDisk = async (temp: string, dest: string) => {
  console.log(temp, dest);
  async function copy(from: string, to: string) {
    await mkdirRecursive(to);
    const entries = await (vol.promises.readdir(from, {
      withFileTypes: true,
    }) as unknown as Promise<IDirent[]>);
    for (const entry of entries) {
      const name = entry.name.toString();
      const sourcePath = path.join(from, name);
      const targetPath = path.join(to, name);
      if (entry.isDirectory()) {
        await copy(sourcePath, targetPath);
      } else {
        await copyFile(sourcePath, targetPath);
      }
    }
  }

  async function copyFile(source: string, target: string) {
    const read = vol.createReadStream(source);
    const write = fs.createWriteStream(target);
    if (!fs.existsSync(target)) {
      await fs.createFileSync(target);
    }
    await new Promise((resolve) => {
      read.pipe(write);
      write.once("finish", resolve);
    });
  }
  await copy(temp, dest);
};

export const create = async (options: {
  dest: string;
  data: any;
  onProgress?: (msg: string, isOk?: boolean) => void;
}) => {
  const { dest, onProgress, data } = options;
  const temp = "temp";
  onProgress?.("start copy and render template");
  await copyDir(temp, data);
  onProgress?.("copy and render template successfully", true);
  onProgress?.("start generating", true);
  await writeToDisk(temp, dest);
  onProgress?.("generating successfully", true);
};
