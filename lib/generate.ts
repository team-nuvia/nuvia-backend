import * as fs from 'fs/promises';
import * as prettier from 'prettier';
import * as readline from 'readline';
import { exec } from 'child_process';
import * as path from 'path';

export async function existsTsconfig(tsconfigName: string = 'tsconfig.json') {
  const file = await fs.readFile(path.join(path.resolve(), tsconfigName), {
    encoding: 'utf-8',
  });
  return file;
}

export function findAlias(depth: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const srcPath = path.join(path.resolve(), 'src');
    exec(`find ${srcPath} -type d -maxdepth ${depth}`, (err, stdout) => {
      if (err) {
        console.error(err);
        reject(new Error('Alias 찾는 중 오류가 발생했습니다.'));
      }
      const aliases = stdout
        .split('\n')
        .filter((line) => line)
        .map((line) =>
          line.endsWith('src') ? 'src/' : 'src' + line.replace(srcPath, ''),
        );
      resolve(aliases);
    });
  });
}

export function convertAlias(alias: string[]): [string, [string]][] {
  return alias
    .map((a) => [
      a.replace('src/', '@') + '/*',
      [a + (a === 'src/' ? '*' : '/*')],
    ])
    .toReversed() as [string, [string]][];
}

export function readInput() {
  return new Promise<boolean>((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on('line', (input) => {
      if (input === 'y') resolve(input === 'y');
      else {
        reject(new Error('Alias 생성을 취소합니다.'));
        rl.close();
        process.exit(1);
      }
    });
  });
}

export async function generateAlias(config: any, alias: [string, [string]][]) {
  Object.assign(config.compilerOptions, { paths: Object.fromEntries(alias) });
  const content = JSON.stringify(config, null, 2);
  const prettyContent = await prettier.format(content, {
    parser: 'json',
  });
  await fs.writeFile(path.join(path.resolve(), 'tsconfig.json'), prettyContent);
}

(async function (depth: number = 1) {
  console.log(`깊이 ${depth}로 탐색합니다.`);

  const config = await existsTsconfig('tsconfig.json');
  const json = JSON.parse(config);

  if (json.compilerOptions.paths) {
    const result = await readInput();
    if (!result) return;
  }

  const alias = await findAlias(1);
  const aliasList = convertAlias(alias);
  await generateAlias(json, aliasList);
})()
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
