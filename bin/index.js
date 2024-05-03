#!/usr/bin/env node

var $8zHUo$process = require("process");
var $8zHUo$cac = require("cac");
var $8zHUo$ora = require("ora");
var $8zHUo$path = require("path");
var $8zHUo$memfs = require("memfs");
var $8zHUo$fsextra = require("fs-extra");
var $8zHUo$stream = require("stream");
var $8zHUo$handlebars = require("handlebars");
var $8zHUo$resolveglobal = require("resolve-global");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}


var $1572597be94ce13f$exports = {};
$1572597be94ce13f$exports = JSON.parse('{"name":"origin-forge","version":"1.0.2","description":"creating a library scaffold generator","source":"src/index.ts","main":"dist/index.js","module":"dist/module.js","types":"dist/types.d.ts","bin":{"of":"./bin/index.js"},"scripts":{"watch":"parcel watch","build":"parcel build --no-cache && node scripts/build.js"},"keywords":["cli","library generate cli"],"author":"","license":"MIT","repository":{"type":"git","url":"https://github.com/maczyt/origin-forge.git"},"bugs":{"url":"https://github.com/maczyt/origin-forge/issues"},"homepage":"https://github.com/maczyt/origin-forge","dependencies":{"cac":"^6.7.14","fs-extra":"^11.2.0","handlebars":"^4.7.8","memfs":"^4.9.1","ora":"5.4.1","resolve-global":"1.0.0"},"devDependencies":{"@parcel/packager-ts":"2.12.0","@parcel/transformer-typescript-types":"2.12.0","@types/fs-extra":"^11.0.4","@types/node":"^20.12.7","parcel":"^2.12.0","typescript":">=3.0.0"}}');








const $e3c79d37e78601e5$var$templatePath = (0, ($parcel$interopDefault($8zHUo$path))).resolve($8zHUo$resolveglobal("origin-forge"), "../../templates");
const $e3c79d37e78601e5$var$mkdirRecursive = async (target)=>{
    try {
        await (0, $8zHUo$memfs.vol).promises.mkdir(target, {
            recursive: true
        });
    } catch (error) {}
};
async function $e3c79d37e78601e5$var$copy(from, to, data) {
    await $e3c79d37e78601e5$var$mkdirRecursive(to);
    const entries = await (0, ($parcel$interopDefault($8zHUo$fsextra))).promises.readdir(from, {
        withFileTypes: true
    });
    for (const entry of entries){
        const name = entry.name.toString();
        const sourcePath = (0, ($parcel$interopDefault($8zHUo$path))).join(from, name);
        const targetPath = (0, ($parcel$interopDefault($8zHUo$path))).join(to, name);
        if (entry.isDirectory()) await $e3c79d37e78601e5$var$copy(sourcePath, targetPath, data);
        else await $e3c79d37e78601e5$var$copyFile(sourcePath, targetPath, data);
    }
}
async function $e3c79d37e78601e5$var$copyFile(source, target, data) {
    const read = (0, ($parcel$interopDefault($8zHUo$fsextra))).createReadStream(source);
    class RenderDataTransform extends (0, $8zHUo$stream.Transform) {
        _transform(chunk, _, callback) {
            const content = chunk.toString();
            const template = (0, $8zHUo$handlebars.compile)(content);
            const result = template(data || {});
            this.push(result);
            callback();
        }
    }
    const write = (0, $8zHUo$memfs.vol).createWriteStream(target);
    await new Promise((resolve)=>{
        read.pipe(new RenderDataTransform()).pipe(write);
        write.once("finish", resolve);
    });
}
const $e3c79d37e78601e5$export$31249a4f7b21ca0f = async (temp, data)=>{
    await $e3c79d37e78601e5$var$copy((0, ($parcel$interopDefault($8zHUo$path))).join($e3c79d37e78601e5$var$templatePath, "library"), temp, data);
};
const $e3c79d37e78601e5$export$ecfa99f2b814ef64 = async (temp, dest)=>{
    async function copy(from, to) {
        await $e3c79d37e78601e5$var$mkdirRecursive(to);
        const entries = await (0, $8zHUo$memfs.vol).promises.readdir(from, {
            withFileTypes: true
        });
        for (const entry of entries){
            const name = entry.name.toString();
            const sourcePath = (0, ($parcel$interopDefault($8zHUo$path))).join(from, name);
            const targetPath = (0, ($parcel$interopDefault($8zHUo$path))).join(to, name);
            if (entry.isDirectory()) await copy(sourcePath, targetPath);
            else await copyFile(sourcePath, targetPath);
        }
    }
    async function copyFile(source, target) {
        const read = (0, $8zHUo$memfs.vol).createReadStream(source);
        const write = (0, ($parcel$interopDefault($8zHUo$fsextra))).createWriteStream(target);
        if (!(0, ($parcel$interopDefault($8zHUo$fsextra))).existsSync(target)) await (0, ($parcel$interopDefault($8zHUo$fsextra))).createFileSync(target);
        await new Promise((resolve)=>{
            read.pipe(write);
            write.once("finish", resolve);
        });
    }
    await copy(temp, dest);
};
const $e3c79d37e78601e5$export$185802fd694ee1f5 = async (options)=>{
    const { dest: dest, onProgress: onProgress, data: data } = options;
    const temp = "temp";
    onProgress?.("start copy and render template");
    await $e3c79d37e78601e5$export$31249a4f7b21ca0f(temp, data);
    onProgress?.("copy and render template successfully", true);
    onProgress?.("start generating", true);
    await $e3c79d37e78601e5$export$ecfa99f2b814ef64(temp, dest);
    onProgress?.("generating successfully", true);
};




const $882b6d93070905b3$var$cli = (0, ($parcel$interopDefault($8zHUo$cac)))("of");
$882b6d93070905b3$var$cli.command("new <libraryName>", "create a library.").action(async (libraryName)=>{
    console.log("libraryName", libraryName);
    const spinner = (0, ($parcel$interopDefault($8zHUo$ora)))("start new library").start();
    await (0, $e3c79d37e78601e5$export$185802fd694ee1f5)({
        dest: (0, ($parcel$interopDefault($8zHUo$path))).join($8zHUo$process.cwd(), libraryName),
        data: {
            libraryName: libraryName
        },
        onProgress (msg, isOk) {
            spinner.color = isOk ? "green" : "blue";
            spinner.text = msg;
        }
    });
    spinner.succeed("Successful");
});
$882b6d93070905b3$var$cli.help();
$882b6d93070905b3$var$cli.version((0, (/*@__PURE__*/$parcel$interopDefault($1572597be94ce13f$exports))).version);
$882b6d93070905b3$var$cli.parse();


//# sourceMappingURL=index.js.map

