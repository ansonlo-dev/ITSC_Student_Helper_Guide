<script setup lang="ts">
// The default layout plus the one overlay that has to live outside the page
// content: the screenshot viewer.
import DefaultTheme from 'vitepress/theme'
import ImageLightbox from './components/ImageLightbox.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <ImageLightbox />
    </template>
  </Layout>
</template>
