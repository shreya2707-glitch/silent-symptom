<div align="center">

```
┌─────────────────────────────────────────────┐
│  🩺  SILENT SYMPTOM                           │
│  entry logged · HACKDAY 1.0 · 8-hour build   │
└─────────────────────────────────────────────┘
```

### *"felt dismissed again today. nobody connects the dots until it's too late."*
**tags:** `#frustration` `#7-10 years` `#finally-building-something`

[![Live Demo](https://img.shields.io/badge/→_try_it_live-3EC6B6?style=for-the-badge)](https://silent-symptom-healt-2k83.bolt.host/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Claude](https://img.shields.io/badge/Claude_AI-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

<br>

## 📖 The Story So Far

Somewhere, right now, someone is writing a note on their phone — *"tired again, joints ache, didn't sleep"* — and deleting it a second later. *Too small to mention. The doctor's busy. It's probably nothing.*

They do this for **years**. Literally — endometriosis, autoimmune disorders, chronic fatigue: the average diagnosis takes **7 to 10 years**, largely because no single symptom ever feels big enough to report on its own.

The pattern was always there. It just never got *organized* long enough to be seen.

**So we built the thing that organizes it.**

<br>

## 🧵 What Silent Symptom Actually Does

```
  you type this ↓                           a doctor sees this ↓
┌─────────────────────────┐              ┌────────────────────────────┐
│ "felt tired again,      │              │  SYMPTOM SUMMARY           │
│  joints ached this      │   ──AI──▶    │  Recurring: fatigue (6x),  │
│  morning, slept badly"  │              │  joint pain (4x). Pattern: │
│                         │              │  worse on poor-sleep days. │
└─────────────────────────┘              └────────────────────────────┘
```

| Feature | What it's really for |
|---|---|
| 📝 **Quick Log** | A blank page, not a form. Say it however it comes out — no medical words required. |
| 📅 **Timeline** | Your scattered notes, finally lined up in order. Flag the ones that felt *different*. |
| 🩺 **Doctor Summary** | One click. Weeks of mess → a report a doctor can skim in 30 seconds. |
| 📊 **Insights** | The pattern you couldn't see while you were living inside it. |

<br>

## 🏗️ How It's Built

```
Patient logs a symptom
        │
        ▼
AI quietly structures it        ← Claude (Anthropic)
        │
        ▼
Stored, private, per-account    ← Supabase
        │
        ▼
Doctor-ready summary, on demand
```

**Stack:** React + Tailwind · Supabase (auth + database) · Claude AI · Recharts · deployed on Bolt.host

<br>

## 🔗 Go Poke At It

**[silent-symptom-healt-2k83.bolt.host →](https://silent-symptom-healt-2k83.bolt.host/)**

Sign up, log two or three entries in plain language over a few "days," then hit **Generate Doctor Summary**. That messy-notes-to-clean-report jump is the whole point of this project — it should feel like a small magic trick.

<br>

## 🗓️ Changelog *(the project's own symptom log, if you will)*

```
v1.2  ·  Security & Polish
      — password strength checks, show/hide toggle, kinder error messages
      — full UI pass: spacing, hover states, typography, consistent cards
      — dark mode audited end-to-end (yes, even the charts)

v1.1  ·  It Got Real
      — moved off localStorage, onto real Supabase auth + database
      — entries now persist per account, seeded with demo history on signup

v1.0  ·  Born at HACKDAY 1.0
      — Quick Log → Timeline → Doctor Summary → Insights, working end to end
      — AI tagging + AI-generated clinical summaries
      — calm, non-clinical visual design, light & dark themes
```

<br>

## 🌱 If We Had More Time

- Wearables plugged in — let sleep and heart-rate data tag along with the symptoms
- A clinician-side view, for reviewing flagged entries before the patient even walks in
- Anonymized, opt-in pattern-sharing across people with similar symptom profiles
- Speaking more than one language, because dismissal isn't an English-only problem

<br>

## 👩‍💻 Built By

**Shreya** — [@shreya2707-glitch](https://github.com/shreya2707-glitch) — at HACKDAY 1.0, in one 8-hour sitting.

<br>

<div align="center">

```
┌─────────────────────────────────────────────┐
│  not a diagnosis. just a pattern, finally    │
│  organized enough for someone to believe.    │
└─────────────────────────────────────────────┘
```

*For personal symptom tracking only — always consult a healthcare professional.*

</div>
