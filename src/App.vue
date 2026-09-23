<template>
  <div class="page">
    <header class="masthead">
      <span class="status-dot" aria-hidden="true"></span>
      <div>
        <h1>Price Matrix Preview</h1>
        <p class="subtitle">Cleaned closing prices, straight from the database</p>
      </div>
    </header>
    <PriceMatrixPreview />
  </div>
</template>

<script setup>
import PriceMatrixPreview from './components/PriceMatrixPreview.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg-base: #0b0d12;
  --bg-panel: #12151d;
  --bg-panel-alt: #171b26;
  --bg-inset: #0e1017;
  --rule: #232838;
  --rule-soft: #1a1e2a;
  --text-primary: #ece8dd;
  --text-muted: #8b93a7;
  --accent: #e3b341;
  --accent-soft: rgba(227, 179, 65, 0.14);
  --up: #4fcb86;
  --down: #e2685b;
  --font-sans: 'IBM Plex Sans', -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg-base);
  color: var(--text-primary);
}

.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.masthead {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 28px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
  margin-top: 9px;
  flex-shrink: 0;
}

h1 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.01em;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .page {
    padding: 32px 16px 48px;
  }
}
</style>
