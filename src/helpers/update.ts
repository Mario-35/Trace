import util from 'util';
const exec = util.promisify(require('child_process').exec);

export async function update() {
  await exec('./trace.sh');
}