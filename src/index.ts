import cac from "cac";
import { readPackageSync } from "read-pkg";

const pkg = readPackageSync();
const cli = cac(pkg.name);

console.log("sss");
