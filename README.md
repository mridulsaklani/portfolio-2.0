# Mridul Singh Saklani — Portfolio

A dark, interactive portfolio built with Next.js, TypeScript, React Three Fiber, and Three.js. One shared canvas changes into a distinct 3D scene for each portfolio chapter. The page includes accessible scene controls, AI and cloud systems explorations, and a private-delivery contact form.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure private contact delivery

Copy `.env.example` to `.env.local` and set `CONTACT_FORM_ENDPOINT` to an HTTPS endpoint you control. The endpoint receives a JSON `POST` body with `name`, `email`, and `message`, and must return a successful HTTP status to confirm delivery. Set `CONTACT_FORM_TOKEN` if the endpoint expects a bearer token. These values are read on the server and are not rendered into the page.

Without a valid endpoint configured, the site clearly reports that message delivery is offline and does not collect the visitor’s message.

## Add real projects later

The current systems lab is explicitly presented as architecture explorations, not shipped project work. Add real case studies to the typed `projectCaseStudies` collection in `src/data/content.ts` when their details are ready to share.
# portfolio-2.0
# portfolio-2.0
