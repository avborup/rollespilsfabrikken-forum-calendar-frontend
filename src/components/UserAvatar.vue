<template>
  <div class="avatar" :style="{
    backgroundImage: `url(${url})`,
  }"></div>
</template>

<script>
export default {
  name: 'UserAvatar',

  props: {
    url: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
}
</style>
