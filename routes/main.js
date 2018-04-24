const crypto = require('crypto');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const Joi = require('joi');
require('dotenv').config();

const rando = function(len) {
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
};

exports.main = {
  path: '/',
  method: 'GET',
  config: {
    validate: {
      query: {
        url: Joi.string().uri().required(),
        viewport: Joi.string().optional(),
        pixelRatio: Joi.number().integer().min(1).optional(),
        wsEndpoint: Joi.string().optional()
      }
    }
  },
  async handler(request, reply) {
    const server = request.server;
    const url = request.query.url;
    const randFldr = rando(18);
    const dir = `./screenshots/${randFldr}`;
    const outputFile = `${dir}/screenshot.png`;
    const wsEndpoint = process.env.BROWSERLESS_URL || request.query.wsEndpoint;
    
    try {
      let browser;

      await fs.ensureDir(dir);
      
      if (wsEndpoint) {
        console.log(`Connecting to browser websocket at "${wsEndpoint}".`);
        browser = await puppeteer.connect({
          browserWSEndpoint: wsEndpoint
        });
      } else {
        browser = await puppeteer.launch();
      }

      const page = await browser.newPage();

      if (request.query.viewport) {
        const [width, height] = request.query.viewport.split(',');
        
        await page.setViewport({
          width: parseInt(width, 10) || 1200,
          height: parseInt(height, 10) || 900,
          deviceScaleFactor: request.query.pixelRatio || 1
        });
      }

      await page.goto(url, {
        waitUntil: 'networkidle0'
      });

      await page.screenshot({
        path: outputFile,
        fullPage: true
      });

      await browser.close();

      server.log(['debug'], outputFile);
      return reply.file(outputFile);
    }
    catch (e) {
        console.log(`Error while parsing "${request.query.url}"`, e);
        server.log(['error'], e);
        return null;
    }

  }
};
