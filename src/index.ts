import cac from "cac";
import ora from "ora";
import pkg from "../package.json";
import { create } from "./helper";
import path from "path";

const cli = cac("of");

cli
  .command("new <libraryName>", "create a library.")
  .action(async (libraryName: string) => {
    console.log("libraryName", libraryName);
    const spinner = ora("start new library").start();

    await create({
      dest: path.join(process.cwd(), libraryName),
      data: {
        libraryName,
      },
      onProgress(msg, isOk) {
        spinner.color = isOk ? "green" : "blue";
        spinner.text = msg;
      },
    });
    spinner.succeed("Successful");
  });

cli.help();
cli.version(pkg.version);
cli.parse();
