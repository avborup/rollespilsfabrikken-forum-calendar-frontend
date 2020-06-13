<template>
  <div class="avatar">
    <img :src="url" alt="Profilbillede">
  </div>
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
  img {
    border-radius: 100%;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}
</style>
