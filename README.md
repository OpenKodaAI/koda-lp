# Koda

> Run AI agents like production software.

Koda is the open-source harness for multi-agent, multi-provider systems.
A control plane you actually use, durable state by default, and every
runtime action inspectable from day one.

## Install

```bash
npx @openkodaai/koda@latest install
```

Providers, agents, secrets, and access live in the dashboard — no
hand-maintained env files. Claude, GPT, Gemini, and Ollama work side by
side; each agent picks the models and tools that fit its role.

## What's inside

- Multi-agent orchestration with isolated runtime state
- Retrieval, episodic memory, and evidence sourcing
- Skills — stored expert prompts exposed as agent abilities
- Durable artifacts on Postgres + S3-compatible storage
- OpenAPI control plane and operator dashboards

## About this repository

`koda-lp` is the public landing page and documentation surface for
Koda. Built with Next.js, React, and Tailwind CSS.

```bash
pnpm install
pnpm dev
```

The Koda runtime itself lives at
[`OpenKodaAI/koda`](https://github.com/OpenKodaAI/koda).

---

Maintained by [OpenKodaAI](https://github.com/OpenKodaAI).
