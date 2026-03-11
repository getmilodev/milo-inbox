function classifySender(address = '') {
  const lower = String(address).toLowerCase();
  const internalDomains = ['getmilo.dev', 'hiremilo.co', 'usemilo.co', 'hellomilo.co', 'agentmail.to'];
  const systemMarkers = ['noreply', 'no-reply', 'mailer-daemon', 'postmaster', 'security-noreply'];
  const domainMatch = lower.match(/@([^>\s]+)/);
  const domain = domainMatch ? domainMatch[1].replace(/[>]/g, '') : '';

  if (internalDomains.includes(domain)) return 'internal';
  if (systemMarkers.some(marker => lower.includes(marker))) return 'system';
  return 'external';
}

function extractInbound(reqBody = {}) {
  if (reqBody.event_type === 'message.received' && reqBody.message) {
    const m = reqBody.message;
    return {
      source: 'agentmail',
      eventType: reqBody.event_type,
      inboxId: m.inbox_id || '',
      threadId: m.thread_id || '',
      messageId: m.message_id || '',
      from: m.from_ || m.from || '',
      to: Array.isArray(m.to) ? m.to.join(', ') : (m.to || ''),
      cc: Array.isArray(m.cc) ? m.cc.join(', ') : (m.cc || ''),
      replyTo: m.reply_to || '',
      subject: m.subject || '(no subject)',
      text: m.text || '',
      html: m.html || '',
      preview: m.preview || '',
      timestamp: reqBody.created_at || new Date().toISOString(),
      raw: reqBody
    };
  }

  const payload = reqBody;
  if (payload.type && payload.type !== 'email.received') {
    return { skip: true, source: 'resend', eventType: payload.type };
  }

  const data = payload.data || payload;
  return {
    source: 'resend',
    eventType: payload.type || 'email.received',
    inboxId: data.to || '',
    threadId: '',
    messageId: data.message_id || '',
    from: data.from || data.sender || '',
    to: Array.isArray(data.to) ? data.to.join(', ') : (data.to || ''),
    cc: Array.isArray(data.cc) ? data.cc.join(', ') : (data.cc || ''),
    replyTo: data.reply_to || '',
    subject: data.subject || '(no subject)',
    text: data.text || data.body || '',
    html: data.html || '',
    preview: data.preview || '',
    timestamp: payload.created_at || new Date().toISOString(),
    raw: payload
  };
}

async function createGithubIssue(inbound, labelKind) {
  const ghToken = process.env.GETMILO_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (!ghToken) return { stored: false, reason: 'missing_github_token' };

  const issueBody = [
    `**Source:** ${inbound.source}`,
    `**Kind:** ${labelKind}`,
    `**From:** ${inbound.from || 'unknown'}`,
    `**To:** ${inbound.to || 'unknown'}`,
    inbound.cc ? `**CC:** ${inbound.cc}` : null,
    inbound.replyTo ? `**Reply-To:** ${inbound.replyTo}` : null,
    `**Subject:** ${inbound.subject}`,
    inbound.inboxId ? `**Inbox:** ${inbound.inboxId}` : null,
    inbound.threadId ? `**Thread ID:** ${inbound.threadId}` : null,
    inbound.messageId ? `**Message ID:** ${inbound.messageId}` : null,
    `**Received:** ${inbound.timestamp}`,
    '',
    '---',
    '',
    (inbound.text || inbound.preview || inbound.html || '').toString().substring(0, 8000),
    '',
    '---',
    '<details><summary>Raw payload</summary>',
    '',
    '```json',
    JSON.stringify(inbound.raw, null, 2).substring(0, 15000),
    '```',
    '</details>'
  ].filter(Boolean).join('\n');

  const labels = ['inbound-email', `inbound-${labelKind}`];
  const ghRes = await fetch('https://api.github.com/repos/getmilodev/milo-website/issues', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ghToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      title: `📧 ${inbound.from || 'unknown'}: ${inbound.subject}`.substring(0, 200),
      body: issueBody,
      labels
    })
  });

  const ghData = await ghRes.json();
  return { stored: ghRes.ok, issue: ghData.number || null, details: ghData };
}

async function autoAcknowledge(inbound) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { sent: false, reason: 'missing_resend_key' };
  if (classifySender(inbound.from) !== 'external') return { sent: false, reason: 'not_external' };

  const replyTarget = inbound.replyTo || inbound.from;
  const recipientInbox = (inbound.to || '').split(',')[0].trim() || process.env.DEFAULT_FROM;
  if (!replyTarget || !recipientInbox) return { sent: false, reason: 'missing_addresses' };

  const subject = inbound.subject && inbound.subject.toLowerCase().startsWith('re:')
    ? inbound.subject
    : `Re: ${inbound.subject}`;

  const text = [
    'Got your note — Callias saw this and will review it shortly.',
    '',
    'If there is a concrete deadline or context we should have, just reply to this thread and include it.',
    '',
    '— Callias',
    'Milo'
  ].join('\n');

  const html = `<p>Got your note — <strong>Callias</strong> saw this and will review it shortly.</p><p>If there is a concrete deadline or context we should have, just reply to this thread and include it.</p><p>— Callias<br>Milo</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: recipientInbox,
      to: [replyTarget],
      subject,
      text,
      html,
      reply_to: recipientInbox
    })
  });

  const data = await response.json();
  return { sent: response.ok, id: data.id || null, details: data };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'milo-website-inbound' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const inbound = extractInbound(req.body || {});
    if (inbound.skip) {
      return res.status(200).json({ status: 'skipped', type: inbound.eventType, source: inbound.source });
    }

    const kind = classifySender(inbound.from);
    const issueResult = await createGithubIssue(inbound, kind);
    const ackResult = await autoAcknowledge(inbound);

    console.log('INBOUND:', JSON.stringify({
      source: inbound.source,
      kind,
      from: inbound.from,
      to: inbound.to,
      subject: inbound.subject,
      inboxId: inbound.inboxId,
      threadId: inbound.threadId,
      issue: issueResult.issue || null,
      ack_sent: ackResult.sent || false
    }));

    return res.status(200).json({
      status: 'received',
      source: inbound.source,
      kind,
      stored: issueResult.stored,
      issue: issueResult.issue || null,
      acknowledged: ackResult.sent || false
    });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(200).json({ status: 'error', message: err.message });
  }
}
