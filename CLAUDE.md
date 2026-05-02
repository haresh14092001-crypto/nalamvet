# Agadham OS: Project Intelligence (CLAUDE.md)

## Project Overview
**Agadham OS** is an India-first veterinary operating system designed for clinic management, AI-assisted intake, triage, documentation, and academic workflows.

### Tech Stack
- **Backend**: Node.js, Express, TypeScript, SQLite (`better-sqlite3`).
- **Frontend (Legacy)**: Standalone PWA HTML modules (Pets/Exotic, Production, Teaching).
- **Frontend (Modern)**: React + Vite (`agadham-os/`).
- **Styles**: Vanilla CSS with Metro/Premium aesthetics.

## Critical Rules

### 1. Architecture & Patterns
- **API First**: All intelligence (dosing, triage) must reside in `apps/api/src/services/`.
- **Safety-First Calculations**: Always use the `drugRules.ts` service for dosages. Never hardcode clinical values in the UI.
- **Relational Integrity**: Use the `database/schema.sql` definitions for all new data models.

### 2. Coding Standards (ECC-Standard)
- **Modularity**: Prefer small, single-responsibility files (200-400 lines typical).
- **TypeScript**: Strict typing is mandatory for all new backend/frontend code.
- **Performance**: Optimize for rapid local execution (SQLite WAL mode enabled).
- **Aesthetics**: UI must be "Metro/Premium" — no generic colors, use high-fidelity CSS variables.

### 3. Workflow
- **Rules**: Follow project guidelines in `.claude/rules/`.
- **Subagents**: Delegate complex tasks to specialized agents in `.claude/agents/` (e.g., `security-reviewer` for API audits).
- **TDD**: Write tests first for clinical logic (calculations, triage routing).

## Project Structure
- `apps/api/`: Node.js Express backend and clinical intelligence.
- `database/`: SQLite database and migration schemas.
- `agadham-os/`: Modern React dashboard.
- `nalamvet_*.html`: Specialized clinical PWA modules.

## Available Specialized Commands
- `/plan` - Create implementation plan (Planner Agent).
- `/code-review` - Professional quality audit (Reviewer Agent).
- `/security-scan` - Security vulnerability check (Security Agent).
- `/tdd` - Test-driven development flow (TDD Agent).

---
*This project is optimized with the Everything Claude Code (ECC) performance system.*
