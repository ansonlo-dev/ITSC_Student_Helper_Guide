# ITSC Student Helper Guide

A VitePress static site documenting duties, procedures and practical tips for
ITSC Student Helpers at Lingnan University.

## Local development

```bash
bun install
bun run docs:dev      # start the dev server
bun run docs:build    # build the static site to docs/.vitepress/dist
bun run docs:preview  # preview the production build
```

## Structure

```
docs/
├── .vitepress/config.mts   # site config: nav, sidebar, search
├── index.md                # home page
├── guide/                  # onboarding: welcome, first shift, code of conduct
├── duties/                 # counter, labs, AV, accounts, printing
├── tips/                   # troubleshooting playbook, communication
└── reference/              # FAQ, contacts & escalation
```

## Contributing

Pages are plain Markdown. Add a page by creating the `.md` file under `docs/`
and adding a matching entry to the `sidebar` in `docs/.vitepress/config.mts`.

Blocks marked `::: info To be filled in` are placeholders that need real
Lingnan University / ITSC details confirmed with a supervisor before use.
