<template>
  <header class="app-drag flex items-center justify-between whitespace-nowrap border-b border-outline-variant/50 bg-surface/92 px-6 py-3.5 backdrop-blur-xl select-none">
    <div class="flex items-center gap-2 pl-16 text-on-surface">
      <h2 class="font-headline text-[17px] font-semibold leading-tight tracking-tight">YBDown</h2>
    </div>
    
    <div class="app-no-drag flex flex-1 justify-end gap-3">
      <nav class="flex items-center gap-1 rounded-md border border-outline-variant/40 bg-surface-container-lowest/85 p-1 shadow-sm">
        <button
          v-for="tab in tabs" 
          :key="tab.key"
          class="flex h-9 items-center gap-1.5 rounded px-3.5 text-sm font-medium transition-colors"
          :class="currentTab === tab.key ? 'bg-surface-container-high text-on-surface shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'"
          @click="$emit('change-tab', tab.key)"
        >
          <MaterialIcon :name="tab.icon" :size="15" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
      
      <button 
        aria-label="Settings" 
        class="flex size-10 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container-lowest/85 text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high hover:text-on-surface"
        @click="$emit('change-tab', 'settings')"
      >
        <MaterialIcon name="settings" :size="18" />
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
