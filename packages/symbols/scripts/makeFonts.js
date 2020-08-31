import { execSync } from 'child_process';
import { readFile, writeFile, unlink } from 'fs/promises';

const unicodeRanges = {
  Accidentals: 'U+ED60-ED66',
};

for (let [name, codepoints] of Object.entries(unicodeRanges)) {
  createFile(name, codepoints);
}

async function createFile(name, codepoints) {
  execSync(
    `pyftsubset scripts/assets/BravuraText.otf --unicodes="${codepoints}" --name-IDs="" --flavor="woff2" --output-file="./src/fonts/${name}.woff2"`
  );

  try {
    const data = (await readFile(`./src/fonts/${name}.woff2`)).toString(
      'Base64'
    );
    const uri = `data:font/woff2;base64,${data.toString('Base64')}`;
    const css = `@font-face {
  font-family: 'MusUI';
  src: url('data:font/woff2;base64,${data}') format('woff2');
  unicode-range: ${codepoints};
}`;

    await writeFile(`./src/fonts/${name}.css`, css);
    await unlink(`./src/fonts/${name}.woff2`);
  } catch (e) {
    console.error(`Error creating subset "${name}: ${e}"`);
  }
}
