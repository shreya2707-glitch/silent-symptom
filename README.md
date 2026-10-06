<div align="center">

<br>

# 🩺 Silent Symptom

### Turning scattered symptoms into a doctor-ready story.

<br>

*Built in 8 hours at **HACKDAY 1.0** · Theme: Tech for a Better Tomorrow*

<br>

[![Live Demo](https://img.shields.io/badge/✦_VIEW_LIVE_DEMO-3EC6B6?style=for-the-badge&labelColor=1B1F3B)](https://silent-symptom-healt-2k83.bolt.host/)

<br>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Claude](https://img.shields.io/badge/Claude-Anthropic_API-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Recharts](https://img.shields.io/badge/Recharts-data_viz-FF6F61?style=flat-square)](https://recharts.org/)
[![Bolt](https://img.shields.io/badge/built_on-bolt.new-000000?style=flat-square)](https://bolt.new/)

<br>

</div>

---

<br>

## 📍 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Who It's For](#-who-its-for)
- [System Architecture](#️-system-architecture)
- [User Flow](#-user-flow)
- [Tech Stack](#️-tech-stack)
- [Live Demo](#-live-demo)
- [Market Snapshot](#-market-snapshot)
- [Changelog](#️-changelog)
- [Roadmap](#-roadmap)
- [Team](#-team)

<br>

---

## 💭 The Problem

<br>

> *"It's not that the symptoms aren't real — it's that they're never organized long enough to become visible."*

<br>

Conditions like **endometriosis**, **autoimmune disorders**, and **chronic fatigue** take an average of **7–10 years** to diagnose. Not because the symptoms aren't there — but because they arrive one quiet complaint at a time. A headache here. Bad sleep there. Too minor to mention on their own, too scattered to ever add up to a pattern — until years have passed.

**Silent Symptom exists to close that gap.**

<br>

---

## ✨ The Solution

<br>

<table>
<tr>
<td width="25" align="center">📝</td>
<td><b>Quick Log</b><br/><sub>Write freely — no medical vocabulary needed. AI quietly extracts symptoms, severity, and body area.</sub></td>
</tr>
<tr>
<td align="center">📅</td>
<td><b>Timeline</b><br/><sub>A tag-filterable history of every entry. Flag the ones that matter most for your next appointment.</sub></td>
</tr>
<tr>
<td align="center">🩺</td>
<td><b>Doctor Summary</b><br/><sub>One click compiles weeks of notes into a clean, clinical-style report — copy, print, or export as PDF.</sub></td>
</tr>
<tr>
<td align="center">📊</td>
<td><b>Insights</b><br/><sub>Visual patterns in frequency and severity over time — spot the trend before your doctor even asks.</sub></td>
</tr>
</table>

<br>

---

## 👥 Who It's For

<br>

| | |
|:---:|---|
| ❤️ | **Underdiagnosed patients** — living with conditions that take years to name |
| ✦ | **Caregivers** — tracking symptoms on behalf of someone who can't log it themselves |
| ⚕️ | **Doctors & specialists** — who want structure instead of a scattered verbal recap |
| ◈ | **Health-conscious individuals** — building self-awareness before it becomes a problem |

<br>

---

## 🏗️ System Architecture

<br>

```mermaid
flowchart TB
    subgraph client["🖥️ CLIENT — React + Tailwind"]
        UI_LOG["Quick Log"]
        UI_TL["Timeline"]
        UI_SUM["Doctor Summary"]
        UI_INS["Insights"]
    end

    subgraph services["⚙️ SERVICES"]
        CLAUDE["🧠 Claude API\ntagging + summarization"]
        SUPA_AUTH["🔐 Supabase Auth\nemail + password"]
        SUPA_DB[("🗄️ Supabase Postgres\nentries, per-user")]
    end

    subgraph host["☁️ HOSTING"]
        BOLT["Bolt.host\nstatic + edge deploy"]
    end

    UI_LOG -- "raw symptom text" --> CLAUDE
    CLAUDE -- "tags · severity · body area" --> SUPA_DB
    UI_TL -- "fetch entries" --> SUPA_DB
    UI_SUM -- "fetch all entries" --> SUPA_DB
    UI_SUM -- "compile prompt" --> CLAUDE
    CLAUDE -- "clinical-style report" --> UI_SUM
    UI_INS -- "fetch for charts" --> SUPA_DB
    UI_LOG & UI_TL & UI_SUM & UI_INS -. "session token" .-> SUPA_AUTH
    client -. "served from" .-> BOLT

    style client fill:#1B1F3B,color:#FAFAF8,stroke:#3EC6B6
    style services fill:#242530,color:#FAFAF8,stroke:#FF6F61
    style host fill:#262B52,color:#FAFAF8,stroke:#3D4B94
```

<br>

---

## 🔁 User Flow

<br>

```mermaid
flowchart LR
    A([Open app]) --> B{Logged in?}
    B -- no --> C[Sign Up / Login]
    C --> D[Session created]
    D --> E["Seeded with\nsample history"]
    B -- yes --> F[Quick Log entry]
    E --> F
    F --> G["Claude extracts\ntags + severity"]
    G --> H[(Saved to Supabase)]
    H --> I[Appears on Timeline]
    I --> J{Flag it?}
    J -- yes --> K[Pinned for summary]
    J -- no --> L[Chronological order]
    K --> M[Generate Doctor Summary]
    L --> M
    M --> N["Claude compiles\nclinical report"]
    N --> O[Copy / Print / PDF]
    O --> P([Bring to appointment])

    style A fill:#3EC6B6,color:#1B1F3B
    style P fill:#FF6F61,color:#1B1F3B
    style G fill:#3D4B94,color:#FAFAF8
    style N fill:#3D4B94,color:#FAFAF8
```

<br>

---

## 🛠️ Tech Stack

<br>

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + Tailwind CSS | Fast iteration under hackathon time pressure, fully responsive |
| **Auth & Database** | Supabase | Real accounts & private data, without hand-rolling a backend |
| **Intelligence** | Claude (Anthropic API) | Structures free-text into tags, severity, and clinical summaries |
| **Visualization** | Recharts | Native charting for the Insights panel |
| **Hosting** | Bolt.new / Bolt.host | Zero-config deploy, live link in seconds |

<br>

---

## 🔗 Live Demo

<br>

<div align="center">

### **[→ silent-symptom-healt-2k83.bolt.host](https://silent-symptom-healt-2k83.bolt.host/)**

</div>

<br>

1. Sign up — a short sample history will already be waiting
2. Log a few entries in your own words, across a few "days"
3. Open **Doctor Summary** → click **Generate**
4. Watch weeks of scattered notes become a 30-second-skim report
5. Toggle dark mode, just to see that it holds up too

<br>

---

## 📈 Market Snapshot

<br>

| Metric | Value |
|---|---|
| Digital health market size (2025) | **$573B** |
| Projected market size (2034) | **$2.09T** |
| CAGR (2026–2034) | **15%** |

<sub>Source: IMARC Group, Digital Health Market Report, 2025</sub>

**Business model:** Freemium (free logging, paid AI summaries/PDF export) · B2B2C (clinics, therapists, insurers) · API licensing (telehealth & EHR platforms)

<br>

---

## 🗓️ Changelog

<br>

**`v1.2`** — Security & Polish
Password strength UX, show/hide toggle, kinder error messages · full UI refinement pass (spacing, hover states, typography) · dark mode audited end-to-end, charts included

**`v1.1`** — It Got Real
Migrated localStorage → Supabase (auth + database) · entries persist per authenticated account · new signups auto-seeded with sample history

**`v1.0`** — Genesis
Born at HACKDAY 1.0 in one 8-hour sitting · core pipeline working end-to-end · light/dark theme and calm visual design established

<br>

---

## 🌱 Roadmap

<br>

- [ ] **Wearable integration** — sleep & heart-rate data correlated with symptoms
- [ ] **Clinician dashboard** — doctor-side view for flagged entries pre-visit
- [ ] **Community insights** — anonymized, opt-in pattern-sharing
- [ ] **Multi-language support** — dismissal isn't an English-only problem
- [ ] **Voice-based logging** — speak an entry on low-energy, high-pain days
- [ ] **Deeper EHR handoff** — direct, secure export into patient portals

<br>

---

## 👩‍💻 Team

<br>

**Shreya** — [@shreya2707-glitch](https://github.com/shreya2707-glitch)
*Solo build, 8 hours, HACKDAY 1.0*

<br>

---

<div align="center">

<br>

*Not a diagnosis. Just a pattern, finally organized enough for someone to believe.*

**For personal symptom tracking only — always consult a licensed healthcare professional.**

<br>

### Built in 8 hours. Designed to matter for years. 🩺

<br>

</div>
