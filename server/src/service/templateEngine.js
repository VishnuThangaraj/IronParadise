const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const renderTemplate = (templatePath, data = {}) => {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    templatePath,
  );

  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);

  return template(data);
};

module.exports = renderTemplate;
