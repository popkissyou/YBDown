<template>
  <header class="app-drag flex h-[68px] items-center justify-between whitespace-nowrap border-b border-outline-variant/45 bg-surface/95 px-6 backdrop-blur-xl select-none">
    <div class="flex items-center gap-3 pl-16 text-on-surface">
      <div class="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary-container text-primary shadow-sm">
        <MaterialIcon name="arrow_downward" :size="20" :weight="500" />
      </div>
      <div class="flex flex-col leading-tight">
        <h2 class="font-headline text-[17px] font-semibold">YBDown</h2>
        <span class="mt-0.5 text-[11px] font-medium text-on-surface-variant">Local media downloader</span>
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
</style>
