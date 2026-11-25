# Living Hope Chaplaincy — homepage (v2)

A single static homepage built to Steven's wireframe. Plain HTML, CSS, and JavaScript: no build step, no frameworks. All paths are relative, so it runs on GitHub Pages as-is.

```
index.html     the homepage
partners.html  Partner with us (hospitals + churches), with a contact form
volunteer.html Volunteer page: what it takes, how to join, and the two volunteer forms
styles.css     all styling (colors, fonts, layout, animations)
script.js      the scroll effects, menu, and section reveals
images/        logo, tree, and photos (already compressed for the web)
.nojekyll      tells GitHub Pages to serve the files exactly as they are
```

## Preview on your computer

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8000`
3. Visit http://localhost:8000

(You can also double-click `index.html`, but a local server is closer to how GitHub serves it.)

## Put it online with GitHub Pages

1. Sign in at https://github.com and click **New** (or the **+** menu, then **New repository**).
2. Name it, for example `living-hope-chaplaincy`. Choose **Public** (free GitHub Pages needs a public repo). Click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Unzip `living-hope-site-v2.zip` on your computer, select **everything it contains** (`index.html`, `partners.html`, `volunteer.html`, `styles.css`, `script.js`, `README.md`, `.nojekyll`, and the `images` folder) and drag it into the upload area.
   - `.nojekyll` is a hidden file. On a Mac press **Cmd + Shift + .** in Finder to show it; on Windows turn on **View > Hidden items**. If it doesn't upload, the site still works; it's a safety net.
   - `index.html` must be at the top level of the repo, not inside a subfolder.
5. Click **Commit changes**.
6. Go to the repo's **Settings > Pages**.
7. Under **Build and deployment**, set **Source** to **Deploy from a branch**, **Branch** to `main`, folder `/ (root)`, and click **Save**.
8. Wait a minute or two, then refresh the page. GitHub shows the live address, like `https://YOUR-USERNAME.github.io/living-hope-chaplaincy/`.

To update the site later, upload the changed files to the repo the same way. GitHub republishes automatically.

## Later: use livinghopechaplaincy.com (custom domain)

Only do this once the client has approved the new site. It takes the old GoDaddy site off the domain.

1. In the repo, go to **Settings > Pages > Custom domain**, enter `livinghopechaplaincy.com`, and click **Save**. GitHub creates a `CNAME` file in the repo; leave it there.
2. In GoDaddy (**My Products > Domains > livinghopechaplaincy.com > DNS**):
   - Replace the `@` **A** records with GitHub's four addresses: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Set the `www` **CNAME** record to `YOUR-USERNAME.github.io`
   - Write down the old records first so you can switch back if needed.
3. DNS can take from a few minutes up to 24–48 hours. When GitHub's Pages settings show the domain as verified, tick **Enforce HTTPS**.
4. Check GitHub's current docs before changing DNS, in case the addresses have changed: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

## TODO before launch

Search the `.html` files for `data-todo` to find each one.

- **Subscribe form is not connected.** It shows a thank-you message but sends nothing. Connect it to the client's email service (for example Mailchimp, MailerLite, or Constant Contact) by pasting that service's form action URL into the `<form>` tag.
- **Request a visit form (fix this one).** The "Request a visit online" button on `index.html` still points to `cognitoforms.com/s/EoxqCCvV6kKb1FON8uzxSw`. That address is Cognito's embed *script*, not a page, so clicking it shows a screen of code. On the current site, visit requests go through a GoDaddy form, and the Cognito forms found are the volunteer application (form 1) and the volunteer reporting form (form 2). Confirm which form should take visit requests (or create one in Cognito), then link to its public page (`https://www.cognitoforms.com/f/EoxqCCvV6kKb1FON8uzxSw/<form number>`) or embed it.
- **Instagram** icon is a placeholder (`#`); the current site has no Instagram link. Replace or remove it.
- **Future pages** linked from here that don't exist yet: `about.html` (Read more). Hospitals and churches now live on `partners.html` (`#hospitals`, `#churches`).
- **Partner contact form** on `partners.html` is not connected yet (see below).
- **Homepage "Get in touch" strip** (`index.html`, `#get-in-touch`) is not connected yet either. Steven will send who should receive these messages; set it up the same way as the partner form (put the endpoint in the form's `data-endpoint`). To remove the strip, delete the block between the `START`/`END: Get in touch strip` comments in `index.html` and the "Get in touch strip" block in `styles.css`. `script.js` needs no change.
- **Volunteer forms** on `volunteer.html` show placeholders where the Cognito forms will go (see below).
- **Scripture PDFs** still load from the old GoDaddy site (12–18 MB each). Compress them, add them to this repo, and update the links, so they keep working after the domain moves.
- The hidden training page is deliberately **not** linked anywhere on this page.

## Partner contact form (partners.html)

The form at the bottom of `partners.html` collects: name, organization, role, "I'm reaching out about" (Hospital partnership / Church partnership / Other), email, phone, and message. GitHub Pages can't receive form submissions by itself, so it needs a form service. Until one is connected, submitting shows the thank-you message with a note that nothing was sent.

Pick one:

1. **Formspree (simplest, works with this exact form).** Create a free form at https://formspree.io, copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`), and paste it into the form tag in `partners.html`:
   `data-endpoint="https://formspree.io/f/abcdwxyz"`
   That's it: `script.js` sends the form there and shows the thank-you message. Set the notification email in Formspree to whoever should get partnership inquiries. (Formspree's free plan has a monthly submission limit; check their current pricing.) Similar services that also accept a plain POST: Basin, Getform, Web3Forms.
2. **Cognito Forms (keeps everything in the account the client already uses).** In the Living Hope Cognito account, create a "Partner inquiry" form with the same fields, then replace the whole `<form id="partner-form">…</form>` block (and the thank-you `div` after it) with Cognito's embed code. Cognito handles the thank-you message and the email notifications.

The form already includes a hidden spam-trap field (`_gotcha`), which Formspree recognizes.

Links into this page: `partners.html#hospitals`, `partners.html#churches`, `partners.html#contact-us`. Adding `?about=hospital` or `?about=church` pre-selects the topic in the form (for example `partners.html?about=church#contact-us`).

## Volunteer forms (volunteer.html)

The forms area near the bottom of `volunteer.html` has two tabs. Each tab has a button that opens the form on Cognito in a new tab (this works today), plus a dashed box where the form itself can be embedded.

| Tab | Section id | Cognito form | Button link (works now) |
| --- | --- | --- | --- |
| Join the team | `#join` | form 1, "Volunteer application" (the one on the current /volunteer page) | `https://www.cognitoforms.com/f/EoxqCCvV6kKb1FON8uzxSw/1` |
| Log a visit | `#log-visit` | form 2, "Volunteer reporting form" (the one on the current hidden /volunteers page) | `https://www.cognitoforms.com/f/EoxqCCvV6kKb1FON8uzxSw/2` |

To embed a form on the page:

1. In `volunteer.html`, find `data-todo="join-form-embed"` (or `log-visit-form-embed`).
2. Just inside it is a comment with the exact embed code the current site uses, for example:
   ```html
   <script src="https://www.cognitoforms.com/s/EoxqCCvV6kKb1FON8uzxSw"></script>
   <script>Cognito.load("forms", { id: "1" });</script>
   ```
3. Replace the `<div class="embed-placeholder">…</div>` with that code. If both forms are embedded, include the first `<script src=…>` line only once on the page. The dashed box styling turns itself off once the form loads.
4. If you swap in a different form, get its code from Cognito (**Publish > Embed > Seamless**) and update the button link to that form's number.

No form yet for one of the tabs? Add the class `is-coming-soon` to its `.embed-slot`, change the placeholder text to "Form coming soon", and remove or hide that tab's button.

Links into this page: `volunteer.html#join` and `volunteer.html#log-visit` open the matching tab and scroll to it (the partners page uses `volunteer.html#join`). The page's "Send us a message" button goes to `partners.html?about=other#contact-us`.

Note: the reporting form used to live on a page that wasn't in the site menu. The "Log a visit" tab makes it reachable from the public volunteer page. That's what was asked for; just be aware anyone can open it.
