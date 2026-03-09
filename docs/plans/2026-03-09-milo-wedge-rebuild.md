# Milo Wedge Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild Milo's core site copy around the approved agency / professional-service wedge while preserving the existing design system and page structure.

**Architecture:** This is a static-site message refactor, not a redesign. Keep structure, nav, footer, and interactions intact. Update only copy, metadata, and the build wizard's option/result language so the public story aligns with the research-backed wedge.

**Tech Stack:** Static HTML, inline CSS/JS, Vercel rewrites, shared `milo-design-system.css`

---

### Task 1: Add strategy documentation

**Files:**
- Create: `docs/thesis-2026-03-09-milo-rebuild.md`
- Create: `docs/plans/2026-03-09-milo-wedge-rebuild-design.md`
- Create: `docs/plans/2026-03-09-milo-wedge-rebuild.md`

**Step 1: Write the thesis document**

Document:
- chosen wedge
- rejected wedges
- rebuild principles
- specific testable outcome

**Step 2: Write the short design doc**

Document:
- page-by-page message architecture
- constraints
- pricing interpretation

**Step 3: Save the implementation plan**

List the exact files and verification steps for the rebuild.

**Step 4: Review docs for consistency**

Check:
- no receptionist positioning
- testable outcome is explicit
- wedge language matches the research

### Task 2: Rewrite the homepage around the wedge

**Files:**
- Modify: `index.html`

**Step 1: Update metadata and structured data copy**

Change:
- `<title>`
- meta description
- og title / description
- schema description / service labels if needed

**Step 2: Rewrite hero and top narrative**

Keep layout intact. Change copy to:
- speak to agencies / professional-service firms
- emphasize scattered AI usage vs dependable systems
- highlight proposals, reporting, follow-up, and research

**Step 3: Rewrite service and credibility sections**

Keep structure intact. Change copy so:
- the AI Agent Teams offer is wedge-specific
- the Executive AI offer stays secondary
- ownership and handoff are concrete, not generic

**Step 4: Rewrite CTA block**

Keep pricing box and CTA structure intact, but make the CTA fit the wedge.

### Task 3: Rewrite the services page around workflow systems

**Files:**
- Modify: `agents.html`

**Step 1: Update metadata, schema, and FAQ wording**

Keep valid JSON-LD, but shift descriptions away from generic SMB admin language toward the chosen workflows.

**Step 2: Rewrite hero and positioning**

Keep layout intact. Change hero to:
- address the "we use AI, but not dependably" problem
- speak to owners and operators

**Step 3: Rewrite the roster and differentiation sections**

Change the six problem/solution items to fit:
- proposals
- reporting
- follow-up
- research
- delivery coordination
- inbox / internal ops support

**Step 4: Reframe pricing copy**

Keep pricing structure intact. Make `$399` read as a bounded starting point.

### Task 4: Rework the build wizard copy and recommendation language

**Files:**
- Modify: `build.html`

**Step 1: Rewrite hero and step copy**

Keep the wizard mechanics unchanged.

**Step 2: Update industry options where needed**

Bias options toward agencies / consulting / professional-service use without removing general usability.

**Step 3: Rewrite pain-point labels**

Replace generic admin pains with wedge-relevant workflow pains.

**Step 4: Rewrite result language and agent descriptions**

Keep the JS structure working, but change:
- result title/subtitle
- `agentDB` names, roles, descriptions, hours if needed
- industry labels
- CTA text

### Task 5: Tighten the demo page conversion copy

**Files:**
- Modify: `demo.html`

**Step 1: Rewrite hero and sidebar**

Keep layout intact. Make the call feel like a workflow mapping session for high-fit firms.

**Step 2: Update field guidance and placeholder text**

Bias the form prompt toward proposal, reporting, follow-up, and research pain.

### Task 6: Verify and deploy

**Files:**
- Review changed files only

**Step 1: Run correctness review**

Check:
- message consistency across pages
- no deprecated receptionist language in edited pages
- no broken JSON-LD syntax
- no broken JS string literals in `build.html`

**Step 2: Run mechanical checks**

Run:
- `rg -n "receptionist|phone answering|answering service" index.html agents.html build.html demo.html`
- `node --check build.html` is not applicable because HTML; instead use targeted parsing checks with `python3` or `node` on extracted scripts if needed
- local smoke checks via static server + HTTP fetch

**Step 3: Start a local static server and smoke test**

Run a simple local server, then verify:
- `/`
- `/agents`
- `/build`
- `/demo`

**Step 4: Commit and push to main**

Use the repo's deploy workflow after verification so Vercel auto-deploys.

