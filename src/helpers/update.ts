import {execSync} from 'child_process';

export async function update() {
  execSync('curl -L -O https://github.com/Mario-35/trace/raw/refs/heads/main/dist.zip && unzip --fo dist.zip -d ./trace/');
  process.exit(0);
}