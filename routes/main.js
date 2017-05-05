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
    const server = request.server;
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

    const output = exec(command.join(" "), (err, stdout, stderr) => {
      reply.file(`${dir}/screenshot.png`);
    });

    output.stdout.on('data', (data) => {
      server.log(['debug'], data);
    });
    
    output.stderr.on('data', (data) => {
      server.log(['error'], data);
    });
  }
};
