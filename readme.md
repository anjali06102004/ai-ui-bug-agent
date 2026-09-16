# 🤖 AI UI Bug Detection Agent

An AI-powered agent that autonomously explores web applications, interacts with UI elements, collects browser-level evidence, and detects potential UI bugs.

> 🚧 **Project Status:** Early development
> Current focus: browser automation and autonomous UI exploration.

## 🎯 Vision

The goal of this project is to build an AI agent that can test the **first-stage UI experience** of web applications with minimal human intervention.

Instead of manually checking every page, button, form, and responsive state, the agent will:

```text
Website URL
     ↓
Explore Application
     ↓
Interact with UI
     ↓
Collect Evidence
     ↓
Detect Potential Issues
     ↓
Verify Issues
     ↓
Generate Bug Reports
```

## ✨ Current Capabilities

The current browser exploration layer can:

* Open a user-provided website
* Discover internal links
* Explore multiple pages automatically
* Detect buttons, inputs, text fields, and headings
* Scroll through pages
* Interact with selected safe UI elements
* Skip potentially destructive actions
* Capture screenshots
* Monitor browser console errors
* Save exploration results as JSON

## 🏗️ Current Architecture

```text
                    Website URL
                         │
                         ▼
                ┌─────────────────┐
                │ Browser Agent   │
                │   Playwright    │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Page Explorer   │
                └────────┬────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          DOM Data   Screenshots   Console
              │          │          │
              └──────────┼──────────┘
                         ▼
                 Exploration Data
```

## 🛠️ Tech Stack

### Current

* **TypeScript**
* **Node.js**
* **Playwright**

### Planned

* **LLM / Vision Models**
* **LangGraph**
* **Supabase / PostgreSQL**
* **Next.js**
* **RAG**
* **Computer Vision**
* **GitHub / Jira integrations**

## 📂 Project Structure

```text
ai-ui-bug-agent/
│
├── backend/
│   ├── src/
│   │   ├── agent.ts
│   │   ├── explorer.ts
│   │   └── types.ts
│   │
│   ├── screenshots/
│   ├── exploration-results.json
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

> Generated screenshots and exploration results should normally remain local and be excluded from Git.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-ui-bug-agent.git
cd ai-ui-bug-agent/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browser

```bash
npx playwright install chromium
```

### 4. Run the agent

```bash
npm run agent https://example.com
```

Replace the URL with the web application you want to explore.

## 🔍 Example

Running:

```bash
npm run agent https://example.com
```

currently produces information such as:

```text
Exploring: https://example.com/

Title: Example Domain

Buttons: [...]
Inputs: [...]

Console Errors: [...]

Screenshot: screenshots/page-1.png
```

The agent also stores collected exploration data in JSON for later analysis.

## 🧠 Planned AI Layer

The next stage is to introduce AI-based reasoning.

The agent will combine multiple signals rather than relying only on screenshots:

```text
Screenshot
    +
DOM
    +
Element dimensions
    +
Console errors
    +
Network failures
    +
User interactions
    +
Responsive states
          ↓
      AI Analyzer
          ↓
   Potential UI Bug
          ↓
    Verification Agent
          ↓
       Bug Report
```

## 🐛 Planned Bug Detection

The planned system will investigate issues such as:

* Broken images
* Misaligned UI elements
* Element overlap
* Text clipping
* Content overflow
* Elements outside the viewport
* Broken links
* Missing or invisible UI elements
* Responsive layout problems
* Form/UI interaction issues
* Console and network-related UI failures

The system will distinguish between **signals** and **verified bugs** to reduce false positives.

## 🗺️ Roadmap

### Phase 1 — Browser Exploration ✅

* [x] Launch browser
* [x] Open target URL
* [x] Discover internal pages
* [x] Extract UI elements
* [x] Capture screenshots
* [x] Capture console errors

### Phase 2 — Interaction Engine 🚧

* [x] Safe button interaction
* [x] Visibility checks
* [x] Scroll handling
* [ ] Form interaction
* [ ] Modal detection
* [ ] Navigation state tracking
* [ ] Better interaction recovery

### Phase 3 — Deterministic Bug Detection

* [ ] Broken image detection
* [ ] Broken link detection
* [ ] Element overflow detection
* [ ] Overlap detection
* [ ] Off-screen element detection
* [ ] Responsive layout checks

### Phase 4 — AI Bug Analysis

* [ ] LLM integration
* [ ] Vision-based screenshot analysis
* [ ] DOM + screenshot reasoning
* [ ] Bug classification
* [ ] Severity estimation
* [ ] False-positive verification

### Phase 5 — Autonomous AI Agent

* [ ] Agent planning
* [ ] Multi-step exploration
* [ ] State-aware interaction
* [ ] Retry and recovery
* [ ] Memory
* [ ] Optional RAG for UI guidelines and historical bugs

### Phase 6 — Developer Workflow

* [ ] Bug report generation
* [ ] Jira integration
* [ ] GitHub issue creation
* [ ] Dashboard
* [ ] Test history
* [ ] Bug analytics

## 💡 Why This Project?

Traditional UI testing often depends heavily on predefined test cases.

This project explores a different approach:

> **Give the agent an application, and let it discover what should be tested.**

The long-term goal is an AI testing agent that can **observe, reason, interact, verify, and report**.

## 🤝 Contributions

This project is currently under active development. Ideas, issues, and improvements are welcome.

## 📄 License
This project is licensed under the [Anjali Kumari](2026).

Copyright (c) 2026 Anjali Kumari
