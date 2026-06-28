<template>
  <header class="app-drag flex h-[78px] items-center justify-between whitespace-nowrap border-b border-outline-variant/45 bg-surface/96 px-6 backdrop-blur-xl select-none">
    <div class="flex items-center gap-4 pl-16 text-on-surface">
      <div class="brand-logo">
        <div class="brand-logo-glow"></div>
        <MaterialIcon name="download" :size="26" :weight="600" />
      </div>
      <div class="flex flex-col leading-tight">
        <div class="flex items-center gap-2">
          <h2 class="font-headline text-[24px] font-bold text-on-surface">YBDown</h2>
          <span class="rounded-md bg-primary-container px-2 py-0.5 text-[11px] font-bold text-on-primary-container">Mac</span>
        </div>
        <span class="mt-1 text-[12px] font-semibold text-on-surface-variant">视频解析与下载工作台</span>
      </div>
    </div>
    
    <div class="app-no-drag flex flex-1 justify-end gap-3">
      <nav class="flex items-center gap-1 rounded-lg border border-outline-variant/45 bg-surface-container-lowest/90 p-1 shadow-sm">
        <button
          v-for="tab in tabs" 
          :key="tab.key"
          class="flex h-9 min-w-[82px] items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors"
          :class="currentTab === tab.key ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'"
          @click="$emit('change-tab', tab.key)"
        >
          <MaterialIcon :name="tab.icon" :size="16" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
      
      <button 
        aria-label="Settings" 
        class="flex size-11 items-center justify-center rounded-lg border border-outline-variant/45 bg-surface-container-lowest/90 text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high hover:text-on-surface"
        @click="$emit('change-tab', 'settings')"
      >
        <MaterialIcon name="settings" :size="19" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import MaterialIcon from './icons/MaterialIcon.vue'
import type { TabType } from '../types'

defineProps<{
  currentTab: TabType
}>()

defineEmits<{
  (e: 'change-tab', tab: TabType): void
}>()

const tabs = [
  { key: 'download' as TabType, label: '下载', icon: 'download' },
  { key: 'history' as TabType, label: '历史', icon: 'history' },
  { key: 'about' as TabType, label: '关于', icon: 'info' },
]
</script>

<style scoped>
.app-drag {
  -webkit-app-region: drag;
}

.app-no-drag,
.app-no-drag * {
  -webkit-app-region: no-drag;
}

.brand-logo {
  position: relative;
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-primary) 34%, white);
  border-radius: 14px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 92%, white), var(--color-primary-dim)),
    var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--color-primary) 28%, transparent);
}

.brand-logo::after {
  content: '';
  position: absolute;
  inset: 9px;
  border: 1px solid color-mix(in srgb, white 48%, transparent);
  border-radius: 10px;
}

.brand-logo .material-symbols-outlined {
  position: relative;
  z-index: 1;
}

.brand-logo-glow {
  position: absolute;
  width: 70px;
  height: 70px;
  transform: translate(13px, -22px);
  border-radius: 999px;
  background: color-mix(in srgb, white 35%, transparent);
}
</style>
