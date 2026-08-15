# CLAUDE.md: Connectclub (ARCHIVED)

## ⛔ READ FIRST: this repo is archived. Do not build here.

**Standing decision (Tristian, July 13, 2026), reaffirmed August 14, 2026.**
This is the original single-file ConnectClub prototype, one 902-line
`index.html` carrying a 19-industry contact-mapping UI. It is kept for its
history and its ideas. It is **not** where ConnectClub lives now.

- **Do not develop here.** No features, no fixes, no refactors. A change landed
  in this repo reaches nobody, because nothing deploys from it.
- **Do not treat it as the source of truth** for anything about the referral
  program. Its numbers, tiers, and copy are from before the program existed in
  its current form, and reading them as current is the specific mistake this
  file exists to prevent.
- **The one legitimate use** is harvesting an idea from the old contact-mapping
  UI into the live build. Take the idea, not the code.

## Where ConnectClub actually lives

| What | Where |
|---|---|
| The live referral program | `cobbledworks.com/refer/`, built in [`cobbled-control`](https://github.com/sarastrist-crypto/cobbled-control) |
| The professional door | `cobbledworks.com/refer/pro/`, branded **ConnectClub Pro** |
| **Rates, tiers, bonuses: the single source of truth** | `cobbled-works/site/public/refer/pins/ranks.js` |
| Program terms and privacy | `/refer/terms/` and `/refer/privacy/` |
| The full picture | Card 8, `connectclub-referral-network`, in the `cobbled-works` `CAPABILITY-CATALOG.md` |
| Legal, contract, and payout ops | `cobbled-works/strategy/connectclub-referral-boost/program-ops-legal-scope.md` |

**Never restate a rate from memory or from this repo.** Read `ranks.js`. It
carries its own version history, and the catalog card deliberately does not
repeat the numbers for the same reason.

## ⛔ ConnectClub never reads as an MLM

**Standing operator rule (Tristian and Mike, July 22, 2026), all ConnectClub
copy, video, docs, and program material.** People have to feel comfortable
recommending us to friends and business associates.

- No MLM or pyramid mechanics, no recruiting to earn, no downline, no "build
  your team to unlock income." Referrers earn by introducing owners to us.
- Keep the explicit "this is not an MLM" statements that run through the
  program. When in doubt say less rather than piling on earnings hype.
- The medallion tiers are recognition for referral volume, never a downline.
- Pair the earning story with a service guarantee where possible. Lead with
  "you already have trust in the room, nothing new to sell," never pressure.

## Still open: the GitHub archive toggle

The README carries the archived banner, but the repository is still an active
public repo in GitHub's own settings (`"archived": false`, verified August 14,
2026). Only the operator can change that, in
[Settings, Archive this repository](https://github.com/sarastrist-crypto/Connectclub/settings).
Until he does, this repo will keep appearing in listings as live work, which is
exactly how someone ends up building in it by mistake.

## The house rules that still apply here

Reading is fine, so the rules that govern how we report still hold: the
three-word session title, honest claims, no emoji, no em dashes, and the
client-impact guardrail. Canonical versions: the `cobbled-works` CLAUDE.md.
