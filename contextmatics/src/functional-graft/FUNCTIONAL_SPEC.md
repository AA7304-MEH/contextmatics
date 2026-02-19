# FUNCTIONAL SPECIFICATION: CONTEXTMATIC

## 1. Navigation & Header
-   **Logo Link**: Resets view / Navigates to Home. (Element: `div` / `a`)
-   **Nav Links (Desktop)**: Scroll to sections (#features, #pricing, etc.). (Element: `a`)
-   **Sign In Button**: Navigates to `/auth`. (Element: `a`)
-   **Get Started Button**: Navigates to `/auth`. (Element: `a`)
-   **Mobile Menu Toggle**: Opens/Closes mobile drawer. (Element: `button` / `div`)

## 2. Hero Section
-   **Primary CTA ("Start Building Free")**: Navigates to `/auth`. (Element: `button` / `a`)
-   **Secondary CTA ("View Documentation")**: Link to docs. (Element: `button` / `a`)
-   **Version Badge**: Visual indicator, potentially clickable. (Element: `div`)

## 3. Core Features (Bento Grid)
-   **Interactive Cards**: Hover effects reveal details. (Element: `div.card`)
    -   *Semantic Search*
    -   *Auto-Repurpose*
    -   *Analytics*
    -   *Context Engine*

## 4. Footer
-   **Category Links**: Navigation to sub-pages. (Element: `a`)
-   **Social Icons**: External links. (Element: `a`)

## 5. Global Actions
-   **Scroll Behavior**: Sticky nav on scroll.
-   **Animations**: Elements fade in on scroll (`fadeInUp`).
