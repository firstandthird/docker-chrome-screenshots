const crypto = require('crypto');
const exec = require('child_process').exec;

const md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

exports.main = {
  path: '/',
  method: 'GET',
  handler(request, reply) {
    const url = request.query.url;
    const hid = md5(request.query.url);
    const dir = `./screenshots/${hid}`;
    exec(`mkdir -p ${dir} && cd ${dir} && google-chrome --headless --disable-gpu --screenshot ${url}`, (err, stdout, stderr) => {
      console.log(stdout);
      reply.file(`${dir}/screenshot.png`);
    });
  }
};
