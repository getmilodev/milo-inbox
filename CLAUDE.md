# Milo — AI Transformation Partner for Small Business

Milo (getmilo.dev) builds and deploys AI agent systems for small businesses and executives. We audit operations, architect agent teams, deploy to the client's own infrastructure, and transfer full ownership. No lock-in, no recurring fees to us.

## Product Lines

| Product | Price | Audience | Key Selling Point |
|---------|-------|----------|-------------------|
| AI Agent Teams | $399/agent or $2,499 for 4+ (one-time) | SMBs (law, dental, HVAC, accounting, veterinary) | You own everything. ~$40/mo infrastructure only |
| AI for Executives | $2-5K setup + optional monthly retainer | Senior leaders, C-suite | Personal AI stack, strategic literacy, ongoing optimization |

## Competitive Position

- Nobody else sells multi-agent *teams* — competitors sell single tools (Goodcall, Smith.ai, Ruby, Dialzara, etc.)
- We run 12 agents in production ourselves daily — we eat our own cooking
- One-time pricing in a market of monthly subscriptions
- The receptionist/phone-answering product line is **dead**. Never reference it in new content.

<important>
HARD STOPS — things Claude must NEVER do in this project:
1. Reference "AI receptionist", "phone answering", or "answering service" as Milo's product (deprecated — use "AI agent team")
2. Use raw hex or OKLCH color values — always use CSS custom properties from the design system
3. Use card grids, gradient text, glassmorphism, system fonts, or any anti-pattern from ref/design-system.md
4. Push with `gh` CLI (smillunchick account has no access) — always use the getmilodev PAT
5. Drop content when rewriting pages — every paragraph, link, JSON-LD, and meta tag must survive
6. Use `--gold` for text — it fails WCAG AA. Use `--gold-text` instead
7. Add the /security page to the nav — it's linked from within other pages only
</important>

## Deploy Workflow

Static HTML site on Vercel. Auto-deploys on push to main.

```bash
# Always pull first (remote may have diverged)
cd ~/Projects/milo-inbox
git pull --rebase

# After changes: commit and push
git add <changed-files>
git commit -m "Description"
git push https://getmilodev:<PAT>@github.com/getmilodev/milo-inbox.git main
```

After creating/editing pages, ALWAYS commit and push. Don't write files and stop — changes must go live.

New pages require: rewrite in `vercel.json` + add route to cache header regex.

## Architecture

- Static HTML, no build step, no bundler
- All pages are single-file (inline CSS + JS)
- Shared styles: `milo-design-system.css` (single source of truth)
- Routes: `vercel.json` rewrites section
- API: `api/` directory (Vercel serverless functions)
- Ops: `ops/` directory (internal docs, outreach plans — not served)
- Content: `content/` directory (blog posts, industry landings, competitor comparisons)
- Stripe checkout: redirects in `vercel.json` (`/buy/starter`, `/buy/team`)

## Nav Structure

Services(/agents), Audit(/audit), Calculator(/calculator), Build(/build), Start a project(/demo) — 5 items, do not add more without discussion.

## Key Pages

| Page | Purpose |
|------|---------|
| index.html | Homepage — value prop, social proof |
| agents.html | Services overview (AI Agent Teams) |
| executives.html | AI for Executives offering |
| build.html | 3-step wizard → custom agent team recommendation |
| calculator.html | ROI calculator → cost of manual work |
| audit.html | Free AI ops audit → 4-step wizard, personalized report |
| demo.html | Lead form (reads `ref` param from URL for attribution) |
| security.html | Security services (OpenClaw/NanoClaw hardening) |
| blog.html | Blog index |
| industries.html | Industry overview (law, dental, HVAC, veterinary, accounting) |

## Design System

Read `@ref/design-system.md` when creating or editing pages — covers colors, typography, spacing, motion, layout patterns, and anti-patterns.

## Page Templates

Read `@ref/page-structure.md` when creating new pages or modifying nav/footer — contains exact HTML for nav, mobile menu, footer, required JS, and accessibility checklist.

## Verification

When starting a new task, confirm you've read this file by mentioning "Milo" and the relevant product line.
