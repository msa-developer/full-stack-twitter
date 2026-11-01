# Responsive Design with Tailwind — Beginner Guide

## 1. What "responsive" means

One HTML, CSS changes with screen width. Tailwind does it with **media queries** — `sm:` `md:` `lg:` are just classes that only apply above certain widths:

| prefix | applies from width |
|---|---|
| (none) | always |
| `sm:` | 640px+ (big phone) |
| `md:` | 768px+ (tablet) |
| `lg:` | 1024px+ (laptop) |
| `xl:` | 1280px+ (big laptop) |

## 2. The one rule: mobile-first

Unprefixed class = base style for mobile. Prefixed class = override for bigger screen.

**You don't write styles "for mobile" — you write for mobile by default, then fix desktop.**

Real example from `src/pages/Signup.jsx`:

```jsx
<section className="flex justify-center gap-8">
```

On a phone, the SVG icon and the form sit side-by-side, squeezed together.
Fix = stack on mobile, row from tablet up:

```jsx
<section className="flex flex-col md:flex-row items-center gap-8">
```

Read it out loud: "flex column always, flex row when screen is 768px or more."

That's the whole mental model. No `sm:` needed if the mobile style is already what you want — most screens skip most prefixes.

## 3. How to *see* each size — in the browser

1. Run the app, open it in Chrome/Edge.
2. Press `F12`, then `Ctrl + Shift + M` (or click the phone/tablet icon in DevTools).
3. A toolbar appears at top:
   - **Dimensions dropdown** → pick "iPhone SE", "iPad", "Responsive".
   - Drag the handles to resize width freely.
   - The width number shows at top — that's how you know "this is 820px, so `md:` applies but `lg:` not."
4. Third small icon in the toolbar = rotate device. Press to see landscape.

Fastest habit: drag width slowly from 400 → 1400 and watch where the layout breaks. That break point is exactly where you add the next `md:`/`lg:`.

## 4. Workflow (repeat for every page)

1. Style the mobile version with plain classes, check in DevTools at ~375px.
2. Drag wider. Something looks wrong (crammed row, too-wide line)?
3. Add one prefixed class to fix it (`md:flex-row`, `lg:gap-16`).
4. Repeat. Most simple pages need only 1–3 prefixes total, not every class.
