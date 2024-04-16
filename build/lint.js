import path from "path";
import { execSync } from "child_process";

const args = process.argv.slice(2);
let kind = "";
let lintType = "";
let lintCommand = "";
let service = "";

args.forEach((arg) => {
  const [key, value] = arg.split("=");
  if (key === "web" || key === "pwa") {
    kind = key;
  }
  if (key === "eslint" || key === "stylelint") {
    lintType = key;
  }
  if (key === "service") {
    service = value;
  }
});

if (!lintType || !service) {
  console.error("Usage: node lint.js <lintType> service=<service> <kind> ");
  process.exit(1);
}

const CURRENT_PATH = new URL(import.meta.url).pathname;

const projectRoot = path.resolve(path.dirname(CURRENT_PATH), "../");
let directoryPath = path.join(projectRoot, service, kind);

if (!kind) {
  directoryPath = path.join(projectRoot, service);
}

if (lintType === "eslint") {
  lintCommand = `npx ${lintType} --ext .jsx --ext .js -f html -o .reports/eslintReport.html .; exit 0`;
} else if (lintType === "stylelint") {
  lintCommand = ` npx ${lintType} **/*.css --formatter string --output-file .reports/stylelintReport.txt
  `;
}

try {
  execSync(lintCommand, { cwd: directoryPath, stdio: "inherit" });
  console.log(
    `${lintType} report created successfully for ${service}/${
      kind ? kind : "web and pwa"
    }`
  );
} catch (error) {
  console.error("Error occurred:", error);
  process.exit(1);
}
