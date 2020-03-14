<template>
  <div class="view-container">
    <vue-markdown
        class="md-content"
        :html="false"
    >{{ guideMd }}</vue-markdown>
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
.view-container {
  margin: 0.8rem;
}

@media (min-width: 700px) {
  .view-container {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
