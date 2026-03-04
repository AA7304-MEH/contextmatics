# ContextMatics Design System

## 🎨 Modern Tech SaaS Theme (Light Mode)

A professional, trustworthy, and high-conversion aesthetic inspired by Vercel, Linear, and Stripe.

### Design Principles
- **Clean & Airy**: Generous whitespace, keeping layouts uncluttered.
- **Confident**: Bold primary blue (`#2563eb`) for key actions.
- **Technical**: Monospace accents, precise borders, and structured grids.
- **Purposeful**: Every element has a clear function; distinct hierarchy.

### Color Palette

#### Primary
- **Blue**: `#2563eb` (Brand color, primary buttons, links)
- **Blue Hover**: `#1d4ed8`
- **Blue Highlight**: `#eff6ff` (Subtle backgrounds)

#### Backgrounds
- **Main**: `#ffffff` (Pure White)
- **Subtle**: `#f8fafc` (Very light gray for distinct sections)
- **Cards**: `#ffffff` with `border-gray-200`

#### Typography Colors
- **Headings**: `#111827` (Near Black)
- **Body**: `#374151` (Dark Gray)
- **Muted**: `#6b7280` (Gray)

### Components

#### Buttons
- **Primary**: Bold Blue background, White text. Rounded corners (`rounded-lg`). Subtle shadow.
- **Secondary**: Light Gray background (`bg-gray-100`), Dark Gray text. Darker gray on hover.
- **Outline**: Transparent background, `border-gray-200`.

#### Cards
- **Style**: Flat, white background.
- **Border**: 1px solid `#e5e7eb` (gray-200).
- **Shadow**: `shadow-sm` normally, `shadow-md` on hover.
- **Transition**: Fast, precise `0.2s ease-out`.

#### Typography
- **Font**: Inter (sans-serif)
- **Headings**: Tight tracking (`-0.025em`), bold weights (600/700/800).
- **Body**: Relaxed line-height (`1.6`), regular weight.

### Spacing & Layout
- **Container**: Max W 1280px (`max-w-7xl`).
- **Section Padding**: `py-16` to `py-24` (Generous vertical space).
- **Grid Gap**: `gap-8` (2rem) standard.

### Interactive Elements
- **Focus Rings**: All interactive elements must have a distinct `ring-2 ring-blue-500` on focus.
- **Hover States**: Subtle vertical lift (`-translate-y-1`) for cards. Darkening for buttons.
