const crypto = require('crypto');
const https = require('https');

const pe = (s) => encodeURIComponent(s).replace(/!/g,'%21').replace(/\*/g,'%2A').replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29');

function sign(method, url, params, ck, cs, at, as) {
  const op = {
    oauth_consumer_key: ck,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: at,
    oauth_version: '1.0',
  };
  const all = { ...op, ...params };
  const ps = Object.keys(all).sort().map(k => pe(k) + '=' + pe(all[k])).join('&');
  const sb = method + '&' + pe(url) + '&' + pe(ps);
  const sk = pe(cs) + '&' + pe(as);
  op.oauth_signature = crypto.createHmac('sha1', sk).update(sb).digest('base64');
  return 'OAuth ' + Object.keys(op).sort().map(k => pe(k) + '="' + pe(op[k]) + '"').join(', ');
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const authKey = req.headers['x-api-key'];
  if (authKey !== process.env.INTERNAL_API_KEY) return res.status(401).json({ error: 'unauthorized' });

  const { text } = req.body || {};
  if (!text || text.length > 280) return res.status(400).json({ error: 'text required, max 280 chars' });

  const env = process.env;
  const ck = env.TW_CK, cs = env.TW_CS, at = env.TW_AT, as = env.TW_AS;
  if (!ck || !cs || !at || !as) return res.status(500).json({ error: 'creds not set' });

  const apiUrl = 'https://api.twitter.com/2/tweets';
  const body = JSON.stringify({ text });
  const auth = sign('POST', apiUrl, {}, ck, cs, at, as);

  return new Promise((resolve) => {
    const u = new URL(apiUrl);
    const r = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (response) => {
      let d = '';
      response.on('data', c => d += c);
      response.on('end', () => {
        try { res.status(response.statusCode).json(JSON.parse(d)); }
        catch(e) { res.status(response.statusCode).json({ raw: d }); }
        resolve();
      });
    });
    r.on('error', (e) => { res.status(500).json({ error: e.message }); resolve(); });
    r.write(body); r.end();
  });
};
