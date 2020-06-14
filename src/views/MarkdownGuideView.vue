<template>
  <div class="view-container">
    <div class="content-container">
      <vue-markdown
          class="md-content"
          :breaks="true"
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
