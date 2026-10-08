# Trading Journal UI system

The signed-in product follows a clean sports-management dashboard pattern: a compact navy navigation rail, a light slate workspace, white information panels, restrained blue actions, and green process states. The trader should be able to scan results and find the next useful action without losing the context of their setup, execution, reflection, or growth plan.

Visual reference: [Bowls Link sports management dashboard on Dribbble](https://dribbble.com/shots/27793100-Sports-Management-Dashboard-Design-Bowls-Link).

## Foundations

| Token | Light value | Use |
| --- | --- | --- |
| Canvas | `#f3f6f8` | Main workspace background |
| Panel | `#ffffff` | Cards, forms, tables, and charts |
| Panel secondary | `#eaf0f4` | Selected states and inset areas |
| Ink | `#172630` | Primary text |
| Muted | `#60727f` | Supporting labels and copy |
| Navy | `#0c2230` | Navigation and dense summary panels |
| Accent | `#285f83` | Primary actions, focus, and active navigation |
| Process green | `#356c4e` | Completion and positive process states |
| Hairline | `#d9e2e9` | Quiet borders and separators |

Dark mode remains available. The signed-in sidebar stays navy in both themes, while workspace tokens switch the content canvas and panels.

Use compact mono uppercase labels for metadata and tabular numerals for prices and returns. Keep body copy at a comfortable reading size and width. The app-wide CSS variables in `app/globals.css` are the source of truth for panels, navigation, tables, form controls, charts, focus states, and actions.

## Layout and components

- Use a dark, persistent navigation rail and a spacious content canvas with a consistent context bar.
- Group related information into softly curved cards with clear headings, status chips, and compact data rows.
- Use blue for navigation and primary actions, green for process completion, red for losses, and amber for attention.
- Organize trader work around preparation, setup, execution, reflection, and growth.
- Keep the dashboard sequence clear: orient the trader, surface the next action, summarize performance, explore mindset, then connect insights to the roadmap and trade history.
- Keep photography in contextual storytelling areas such as psychology and growth. Analytics and return data stay on high-contrast solid panels.
- Keep primary actions visible and touch-friendly. Use text with icons rather than icon-only actions.
- Mark sample metrics as illustrative. Never imply live market data, broker connectivity, or guaranteed outcomes unless a real integration supports it.
- Apply the workspace system to dashboard, journal, trade details, calculator, roadmap, calendar, imports, reviews, reports, rules, playbooks, coach, profile, and billing routes.

## Motion and accessibility

- Use short, quiet hover responses (roughly 180–300ms); animate position or opacity, not layout dimensions.
- Respect `prefers-reduced-motion`; omit parallax and entrance movement when requested.
- Keep keyboard focus visible, contrast readable, and controls touch-friendly at mobile sizes.
- Motion must clarify progress or hierarchy and must not block reading or form use.
