# Living Hope Chaplaincy — homepage (v2)

A single static homepage built to Steven's wireframe. Plain HTML, CSS, and JavaScript: no build step, no frameworks. All paths are relative, so it runs on GitHub Pages as-is.

```
index.html     the page
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
4. Unzip `living-hope-site-v2.zip` on your computer, open the `site-v2` folder, select **everything inside it** (`index.html`, `styles.css`, `script.js`, `README.md`, `.nojekyll`, and the `images` folder) and drag it into the upload area.
   - `.nojekyll` is a hidden file. On a Mac press **Cmd + Shift + .** in Finder to show it; on Windows turn on **View > Hidden items**. If it doesn't upload, the site still works; it's a safety net.
   - `index.html` must be at the top level of the repo, not inside a `site-v2` folder.
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

Search `index.html` for `data-todo` to find each one.

- **Subscribe form is not connected.** It shows a thank-you message but sends nothing. Connect it to the client's email service (for example Mailchimp, MailerLite, or Constant Contact) by pasting that service's form action URL into the `<form>` tag.
- **Request a visit form.** The button links to the Living Hope Cognito Forms page (`cognitoforms.com/s/EoxqCCvV6kKb1FON8uzxSw`). On the current site, visit requests go through a GoDaddy form, and the Cognito forms found are the volunteer application and the volunteer reporting form. Confirm which Cognito form should take visit requests (or create one), then link or embed it directly.
- **Instagram** icon is a placeholder (`#`); the current site has no Instagram link. Replace or remove it.
- **Future pages** linked from here that don't exist yet: `about.html` (Read more), `hospitals.html`, `churches.html`.
- **Scripture PDFs** still load from the old GoDaddy site (12–18 MB each). Compress them, add them to this repo, and update the links, so they keep working after the domain moves.
- The hidden training page is deliberately **not** linked anywhere on this page.
