// use mdx-js/mdx to compile file from the input path. If the compilation runs into an error, throw an error
import fs from "fs/promises";
import { compile } from "@mdx-js/mdx";

const inputPaths = process.argv.slice(2);
const errors = [];

const promises = inputPaths.map(async (inputPath) => {
  try {
    const input = await fs.readFile(inputPath, "utf8");
    await compile(input)
      .then(() => console.log(`${inputPath} was successfully compiled.`))
      .catch(error => {
        errors.push(`Error during compilation of ${inputPath} : ${error}`);
      });
  } catch (error) {
    errors.push(`Error during reading file ${inputPath} : ${error}`);
  }
});

Promise.all(promises).then(() => {
  if (errors.length > 0) {
    // write all errors details in a file errors.txt
    fs.writeFile("errors.txt", errors.join("\n"));
    throw new Error(errors.join("\n"));
  }
});
