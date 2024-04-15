import core from "@actions/core";

const allChangedFiles = process.env.ALL_CHANGED_FILES.split(" ");

const JS_FILES = [];
const CSS_FILES = [];

allChangedFiles.forEach((file) => {
  if (file.endsWith(".js") || file.endsWith(".jsx")) {
    JS_FILES.push(file);
  } else if (file.endsWith(".css")) {
    CSS_FILES.push(file);
  }
});

core.setOutput("js_changed_files", JS_FILES.join(" "));
core.setOutput("css_changed_files", CSS_FILES.join(" "));
