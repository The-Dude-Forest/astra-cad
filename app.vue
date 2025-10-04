<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="5" />
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>
