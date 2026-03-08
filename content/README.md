# Milo Content & Distribution Package

Everything in this directory is ready to deploy. Created March 6, 2026.

## Quick Wins (5 minutes each, ordered by revenue impact)

### 1. Post the Show HN
File: `show-hn-post.md`  
**Why:** Single biggest traffic opportunity. HN front page = 10,000+ visits in 24 hours.  
**How:** Copy title + text from the file, post at https://news.ycombinator.com/submit. Best time: Tue-Thu 8-10am EST.  
**Estimated impact:** 5,000-50,000 visits if it hits front page.

### 2. Deploy Comparison Pages to getmilo.dev
Files: `smith-ai-alternative.html`, `blog-best-ai-receptionist.html`, `dental-landing.html`  
**Why:** Targets high-intent search queries. People searching "smith.ai alternative" are ready to buy.  
**How:** Copy HTML files to the milo-deploy project, deploy via Vercel CLI.  
**Deploy as:** `/smith-ai-alternative`, `/blog/best-ai-receptionist`, `/dental`  
**Estimated impact:** 50-200 organic visits/month once indexed, high conversion intent.

### 3. Submit to 10+ AI Directories
File: `directory-submissions.md`  
**Why:** Free backlinks + discovery traffic. Compounds over time.  
**How:** Follow the guide — each submission takes 2-3 minutes. Start with Tier 1 directories.  
**Estimated impact:** 100-500 visits/month aggregate, permanent listings.

### 4. Post Reddit Replies
File: `reddit-replies.md`  
**Why:** High-intent threads where people are actively asking about AI receptionists.  
**How:** Post from a personal Reddit account (not a brand account). Space them over 2-3 days.  
**Estimated impact:** 50-300 visits from direct clicks, ongoing traffic from Google indexing.

### 5. Post Quora Answers
File: `quora-answers.md`  
**Why:** Quora pages rank well on Google. Long-term SEO value.  
**How:** Create/use a Quora account, post answers. One standout: auto repair shop owner asking about Smith.ai.  
**Estimated impact:** 20-100 visits/month ongoing as Google indexes the answers.

### 6. PR to awesome-ai-tools (4,500 stars)
File: `awesome-list-pr.md`  
**Why:** Permanent listing in a high-traffic GitHub repo, plus dofollow backlink.  
**How:** Fork, add one line, submit PR. Full instructions in the file. Takes 2 minutes.  
**Estimated impact:** Ongoing developer/tech traffic + SEO authority.

## Also Needed (not content — infrastructure)

### Add GitHub Actions Secrets (2 minutes in GitHub Settings > Secrets)
- `RESEND_API_KEY` — unlocks email outreach workflows
- `STRIPE_SECRET_KEY` — unlocks EARLYMILO25 coupon creation

### Create EARLYMILO25 in Stripe (if secrets not available)
Dashboard > Products > Coupons > Create  
- Type: Percentage off, 25%
- Duration: Once
- Then create Promotion Code: EARLYMILO25

### Pricing Check
Site shows Starter at $399 but Stripe has $299 (price_1T7dh9ARM3BAD7ru8Ab1ky16).
Verify this is intentional.

## File Index

| File | Type | Purpose |
|------|------|---------|
| smith-ai-alternative.html | Landing page | SEO for "smith.ai alternative" |
| blog-best-ai-receptionist.html | Blog post | SEO for "best AI receptionist" |
| dental-landing.html | Landing page | Dental practice vertical |
| directory-submissions.md | Guide | 10+ free directory submissions |
| reddit-replies.md | Copy | 6 Reddit replies for active threads |
| quora-answers.md | Copy | 4 Quora answers for ranked threads |
| awesome-list-pr.md | Guide | PR to 4,500-star GitHub repo |
| show-hn-post.md | Copy | Show HN post + Indie Hackers thread |
