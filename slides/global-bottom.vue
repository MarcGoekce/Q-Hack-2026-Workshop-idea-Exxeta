<template>
  <footer class="exxeta-footer" :class="{ 'exxeta-footer--dark': isBlackSlide }">
    <img
      src="/exxeta-logo-white.svg"
      class="exxeta-footer__mark"
      :class="{ 'exxeta-footer__mark--invert': !isBlackSlide }"
      alt="Exxeta"
    />
    <span class="exxeta-footer__label">Q-Summit 2026 · Agentic Coding with OpenCode</span>
    <span class="exxeta-footer__page">{{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}</span>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext, useDarkMode } from '@slidev/client'

const { $slidev } = useSlideContext()
const { isDark } = useDarkMode()

/**
 * Returns true for slides that use a black background so the footer
 * can swap to the white logo variant and adjust text contrast.
 * Slide 1 (title) and the last slide (thank-you) are black. Also
 * treat the whole deck as "black" when Slidev's dark theme is active.
 */
const isBlackSlide = computed(() => {
  const page = $slidev.nav.currentPage
  const total = $slidev.nav.total
  // Consider the global dark theme from Slidev (useDarkMode) in addition to
  // the title/thank-you slides so the footer/logo updates correctly.
  return page === 1 || page === total || Boolean(isDark?.value)
})
</script>
