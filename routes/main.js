const crypto = require('crypto');
const exec = require('child_process').exec;
const Joi = require('joi');

const rando = function(len) {
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
};

exports.main = {
  path: '/',
  method: 'GET',
  config: {
    validate: {
      query: {
        url: Joi.string().required(),
        viewport: Joi.string().optional()
      }
    }
  },
  handler(request, reply) {
    const url = request.query.url;
    const randFldr = rando(18);
    const dir = `./screenshots/${randFldr}`;

    const command = [];

    command.push(`mkdir -p ${dir} && cd ${dir} &&`);
    command.push('google-chrome --headless --disable-gpu --screenshot');

    if (request.query.viewport) {
      command.push(`--window-size=${request.query.viewport}`);
    }

    command.push(url);

    exec(command.join(" "), (err, stdout, stderr) => {
      console.log(stdout);
      reply.file(`${dir}/screenshot.png`);
    });
  }
};
