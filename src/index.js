import { execSync } from "node:child_process";
import {
  readFileSync as rfs,
  readdirSync as rds,
  existsSync,
  mkdirSync,
} from "node:fs";
import path, { normalize } from "node:path";
import * as url from "url";
import * as fse from "fs-extra";
import moment from "moment";
import rimraf from "rimraf";
import { rootPath, destPath, ftpListName } from "./config.js";

let list = [];
const DAYS_OF_FOLDERS = 10;
const TIME_NOW = moment();

function createFolders(dirBase) {
  const time10daysAgo = TIME_NOW.subtract(DAYS_OF_FOLDERS, "day");

  Array(DAYS_OF_FOLDERS)
    .fill(0)
    .forEach(() => {
      const folderName = time10daysAgo.add(1, "day").format().split("T")[0];
      if (!existsSync(`${dirBase}${folderName}`))
        mkdirSync(`${dirBase}${folderName}`);
    });
}

function deleteOldFolders(dirBase) {
  rds(dirBase).forEach((item) => {
    if (item.split("-").length > 2) {
      // this is a folder, e.g. '2019-01-15'
      const daysDiff = TIME_NOW.diff(item, "day");
      if (daysDiff >= DAYS_OF_FOLDERS) {
        rimraf(`${dirBase}${item}`);
      }
    }
  });
}

async function processCameraFiles() {
  if (list.length > 0) {
    const dirBase = normalize(`${rootPath}\\${list[0]}\\`);

    createFolders(dirBase);
    deleteOldFolders(dirBase);
    const allJpgFiles = rds(dirBase).filter((item) => {
      return item.split(".")[1] === "jpg";
    });

    for await (const fileName of allJpgFiles) {
      const date = fileName.split("_")[1];
      const folderName = `${date.substring(0, 4)}-${date.substring(
        4,
        6
      )}-${date.substring(6, 8)}`;
      await fse.move(
        `${dirBase}${fileName}`,
        `${dirBase}${folderName}/${fileName}`
      );
    }

    list = list.splice(1);
    await processCameraFiles();
  } else {
    console.log("No more cameras to process!");
  }
}

async function start() {
  list = JSON.parse(
    rfs(path.join(rootPath, ftpListName), { encoding: "utf-8" })
  );

  if (list.length > 0) await processCameraFiles();

  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const scriptPath = path.join(__dirname, "./sync.ps1");
  const listPath = path.join(rootPath, ftpListName);
  const scriptArgs = `-listpath "${listPath}" -srcbase "${rootPath}" -destbase "${destPath}"`;

  execSync(`${scriptPath} ${scriptArgs}`, {
    stdio: "inherit",
    encoding: "utf-8",
    shell: "powershell",
  });

  return "DONE!";
}

start()
  .then((result) => console.log("THEN: ", result))
  .catch((err) => console.log("ERR: ", err));
