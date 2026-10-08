# Trading Journal UI system

The product should feel like a calm, precise workspace for reflection. This system applies to every existing route: the authenticated workspace, trade forms and detail views, dashboards and reports, growth tools, calculator, auth screens, and public help, contact, and legal pages. Visual polish comes from hierarchy, typography, image art direction, spacing, and interaction feedback. Avoid gradients, noisy glows, and ornamental UI that competes with trade data.

## Foundations

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#101210` | Main dark surfaces |
| Panel | `#191d19` | Windows, cards, elevated work areas |
| Paper | `#e9e9e1` | Editorial contrast sections |
| Copy | `#f4f2eb` | Primary text on dark surfaces |
| Muted | `#a4aaa1` | Supporting labels and body text |
| Accent | `#a6d9ae` | Focus, completion, and positive process states |
| Hairline | `rgba(255,255,255,.12)` | Dividers and quiet borders |

Use compact mono uppercase labels for metadata and a restrained serif display face for editorial statements. Keep body copy at a comfortable reading size and width. Use tabular numerals for performance values.

The app-wide CSS variables in `app/globals.css` are the source of truth for dark and light themes. Shared shells apply the tokens to panels, navigation, tables, form controls, focus states, and actions. Reuse those tokens in charts and custom components instead of introducing page-specific colors.

## Layout and components

- Use broad editorial sections and asymmetric grids to create rhythm.
- Keep cards softly curved (about 20–24px) with thin borders and solid surfaces.
- Give the workspace a strong frame: inset navigation, a persistent context bar, and clear page-level headings before dense data.
- Use bento layouts to prioritize the few signals a trader needs first; group secondary metrics and detailed history below the main read.
- Add small, meaningful interaction details: selected navigation states, one-pixel lift on hover, clear button feedback, and purposeful icon treatments.
- Treat dashboard previews as rounded desktop windows with clear hierarchy and realistic sample data labels.
- Group information by the trader's task: setup, execution, reflection, and growth.
- Keep primary actions visible, touch-friendly, and verbally clear. Use text with icons rather than icon-only actions.
- Images should support the story and receive meaningful alternative descriptions.
- On the dashboard, reserve photography for the trader's real workflow: market preparation, written reflection, and goal planning. Keep analytics and return data on solid, high-contrast surfaces so the imagery never competes with the numbers.
- Treat the dashboard as a sequence: orient the trader, surface the next action, show performance, explore mindset, then reconnect those insights to the roadmap and trade history.

## Motion

- Use GSAP for entrance choreography, scroll reveals, and restrained parallax.
- Use Lenis for native-scroll-based smoothing and keep ScrollTrigger synchronized to it.
- Use short, quiet hover responses (roughly 180–300ms); animate position or opacity, not layout dimensions.
- Respect `prefers-reduced-motion`; omit parallax and entrance movement when requested.
- Motion must clarify spatial relationships or progress, never block reading or form use.

## Product behavior

- The journal's voice is reflective and non-judgmental. A loss is information; a win is not proof of process quality.
- Mark sample metrics as illustrative. Never imply live market data, broker connectivity, or guaranteed outcomes unless a real integration supports it.
- Preserve accessibility, responsive layout, and user control as design requirements.
- Use one shared page shell per surface (`AppShell`, `PublicShell`, or `auth-shell`) so navigation, spacing, and controls remain consistent across routes.
- Keep buttons and form controls touch-friendly, show clear hover/focus/disabled states, and respect reduced-motion preferences.
- Do not use made-up chart traces or sparkline history to decorate real account metrics; visualizations should reflect recorded trades or be explicitly labeled as sample data.
