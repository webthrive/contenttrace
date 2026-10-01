# ContentTrace billing setup

Paid plans need three free accounts: **Supabase** (sign-in and database), **Stripe** (payments) and **Cloudflare Turnstile** (bot check).
Until the Supabase keys are in Vercel, the site runs as before with no limits. Do the steps in order.

Plans and limits live in `lib/billing/config.ts`.

| Plan | Price | Allowance | Max length per analysis |
|---|---|---|---|
| Free | $0 | 5 analyses / month (15 per IP) | 10,000 characters |
| Pro | $9 / month or $79 / year | 150,000 words / month | 30,000 characters |
| Word Pack | $9 one time | 50,000 words, never expire | 30,000 characters |

---

## 1. Supabase (about 10 minutes)

1. Go to supabase.com and create a project (any name, e.g. `contenttrace`). Choose a region close to Vercel's (US East or US West).
2. **SQL Editor > New query.** Paste the whole file `supabase/migrations/001_billing.sql` and click **Run**. It must finish with "Success".
3. **Authentication > URL Configuration:**
   - Site URL: `https://www.contenttrace.ai`
   - Redirect URLs: add `https://www.contenttrace.ai/auth/callback` (and `http://localhost:3000/auth/callback` for local tests).
4. **Authentication > Sign In / Providers > Email:** keep Email enabled. "Confirm email" can stay on.
5. **Authentication > Emails (SMTP):** the built-in email sender has a low hourly limit. Before launch, connect your own SMTP (Resend, Postmark, SendGrid, or Google Workspace) so sign-in emails always arrive.
6. *(Optional)* Google sign-in: **Authentication > Providers > Google**. Follow Supabase's steps to create an OAuth client in Google Cloud. Then add `NEXT_PUBLIC_GOOGLE_AUTH=true` in Vercel.
7. **Project Settings > API:** copy the **Project URL**, the **anon public** key, and the **service_role** key (keep this one secret).

## 2. Stripe (about 15 minutes)

Recommended: create a separate account for ContentTrace under your existing Stripe login (**account menu, top left > New account**). It keeps statements, payouts and reports apart from your other project.

1. Start in **Test mode** (toggle at the top right).
2. **Product catalog > Add product** three times:
   - **ContentTrace Pro (monthly)**: recurring, $9.00 USD, every month.
   - **ContentTrace Pro (yearly)**: recurring, $79.00 USD, every year. *(You can also add both prices to one "Pro" product.)*
   - **ContentTrace Word Pack**: one-off, $9.00 USD.
   Copy each **Price ID** (starts with `price_`).
3. **Settings > Billing > Customer portal:** turn on "Cancel subscriptions", "Update payment methods", "Invoice history", and "Switch plans" (add the monthly and yearly prices). Save.
4. **Settings > Business > Public details:** set the statement descriptor to `CONTENTTRACE`, and add the support email and website.
5. **Developers > Webhooks > Add endpoint:**
   - URL: `https://www.contenttrace.ai/api/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (starts with `whsec_`).
6. **Developers > API keys:** copy the **Secret key** (starts with `sk_test_` in test mode).
7. *(Optional)* Sales tax: turn on **Stripe Tax**, then add `STRIPE_AUTOMATIC_TAX=true` in Vercel.
8. *(Optional)* Launch discount: **Product catalog > Coupons**, then create a promotion code. The checkout page accepts codes.

When everything works in test mode, repeat steps 2, 5 and 6 in **Live mode** and replace the test keys in Vercel.

## 3. Cloudflare Turnstile (about 5 minutes)

1. dash.cloudflare.com > **Turnstile > Add widget**. A Cloudflare account is free; your domain does not need to be on Cloudflare.
2. Hostname: `www.contenttrace.ai` (add `contenttrace.ai` and `localhost` too). Widget mode: **Managed**.
3. Copy the **Site key** and the **Secret key**.

## 4. Vercel environment variables

Vercel > contenttrace project > **Settings > Environment Variables**. Add each one for **Production** (and Preview if you use it):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (**secret**) |
| `STRIPE_SECRET_KEY` | Stripe secret key (**secret**) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (**secret**) |
| `STRIPE_PRICE_MONTHLY` | price ID for $9 / month |
| `STRIPE_PRICE_YEARLY` | price ID for $79 / year |
| `STRIPE_PRICE_PACK` | price ID for the $9 Word Pack |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key (**secret**) |
| `IP_HASH_SALT` | any long random text (for example, 40 random letters and digits) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.contenttrace.ai` |

Then **Deployments > latest > Redeploy**. Variables that start with `NEXT_PUBLIC_` only take effect after a new build.

## 5. Test checklist (test mode)

1. Open the site in a private window. The bar shows "5 of 5 free analyses left this month".
2. Run 5 analyses. The 6th shows the upgrade box.
3. Click **Sign in**, enter your email, and open the link **in the same browser**. You land on /account.
4. **Pricing > Get Pro.** Pay with the test card `4242 4242 4242 4242`, any future date, any CVC.
5. Back on /account: the plan shows **Pro** and 150,000 words left. A 20,000-character text now works.
6. **Manage billing & invoices** opens the Stripe portal. Cancel there; Pro stays until the period end.
7. Buy a **Word Pack**. /account shows 50,000 pack words.
8. In Stripe > Webhooks, every event shows a **200** response.

## How it works (for future changes)

- `app/api/analyze/route.ts` checks the plan **before** calling Claude, reserves the words, and gives them back if the analysis fails.
- Counters are atomic Postgres functions (`consume_usage`, `consume_pack`), so two parallel requests cannot go over a limit.
- Pro words reset on the 1st of each month (UTC). Pro users who run out use pack words first, then the 5 free analyses.
- The webhook records each Stripe event ID first, so a repeated event is never applied twice.
- Browsers can read only their own profile row. All counters are server-only (service role).
