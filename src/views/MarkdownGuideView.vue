<template>
  <div class="view-container">
    <div class="content-container">
      <vue-markdown
          class="md-content"
          :html="false"
      >{{ guideMd }}</vue-markdown>
    </div>
  </div>
</template>

<script>
/* eslint import/no-webpack-loader-syntax: off */
import VueMarkdown from 'vue-markdown';
import guideMd from 'raw-loader!../assets/markdownGuide.md';

export default {
  name: 'MarkdownGuideView',

  data() {
    return {
      guideMd,
    };
  },

  components: {
    VueMarkdown,
  },
};
</script>

<style lang="scss" scoped>
.content-container {
  margin: 0.8rem;
  padding: 1rem 0;
}

@media (min-width: 700px) {
  .content-container {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
