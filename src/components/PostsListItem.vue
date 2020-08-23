<template>
  <router-link :to="{
    name: 'post',
    params: {
      postId: id,
      forum: forum.pathName,
    },
  }" class="post-link-wrapper">
    <p v-if="pinned" class="pinned-msg">
      <span class="fas fa-thumbtack pin-icon"></span>
      Fastgjort opslag
    </p>
    <li class="post-list-item" :class="{ pinned }">
      <UserAvatar :url="user.avatarUrl" class="avatar" />
      <h4 :title="title">{{ title }}</h4>
      <p class="author-date">
        <span class="author">{{ user.username }}</span>
        <span class="date">
          <span class="sep"> &ndash;</span>
          {{ toElapsedTimeStr(createdAt) }}
        </span>
      </p>
      <div class="post-info">
        <div class="post-comment-info" :title="`${commentCount} kommentarer`">
          <img src="/assets/icons/comment.svg" alt="Comment icon">
          <span class="post-num-comments">{{ commentCount }}</span>
        </div>
      </div>
      <div
        class="post-forum"
        :title="forum.name"
        :style="{
          borderColor: forum.colour,
          color: forum.colour,
        }"
      >
        {{ forum.name }}
      </div>
    </li>
  </router-link>
</template>

<script>
import { toElapsedTimeStr } from '@/dateUtils';
import UserAvatar from '@/components/UserAvatar.vue';

export default {
  name: 'PostsListItem',

  components: {
    UserAvatar,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    },
    forum: {
      type: Object,
      required: true,
    },
    pinned: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    toElapsedTimeStr,
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>

<style lang="scss">
@import '@/assets/scss/theme.scss';

.post-list-item {
  display: grid;
  grid-template-columns: 3rem 1fr 3rem 6rem;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "avatar title       info forum"
    "avatar author-date info forum";
  column-gap: 1rem;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .avatar {
    width: 3rem;
    height: 3rem;
    grid-area: avatar;
  }

  h4 {
    grid-area: title;
    font-size: 1rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .author-date {
    grid-area: author-date;

    .author {
      color: $primary-accent;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .date {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .post-info {
    grid-area: info;

    .post-comment-info {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);

      img {
        height: 1rem;
        margin-right: 0.5rem;
      }
    }
  }

  .post-forum {
    grid-area: forum;
    border-radius: 10rem;
    border-style: solid;
    border-width: 0.1rem;
    text-align: center;
    padding: 0.4rem 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: bold;
    color: $primary-accent;
  }

  &.pinned {
    border-color: $pin-colour;
    padding-top: 1.75rem;
  }
}

.post-link-wrapper {
  position: relative;
}

.pinned-msg {
  color: $pin-colour;
  position: absolute;
  font-size: 0.8rem;
  top: 1.4rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  width: 8rem;
  font-weight: 600;

  .pin-icon {
    transform: rotate(35deg);
    margin-right: 0.4rem;
  }
}

@media (max-width: 600px) {
  .post-list-item {
    grid-template-rows: auto auto;
    grid-template-columns: 2rem 1fr 2.5rem 4rem;
    grid-template-areas:
      "avatar author-date info  forum"
      "title  title  title title";
    column-gap: 0.5rem;
    row-gap: 0.5rem;

    .avatar {
      width: 2rem;
      height: 2rem;
    }

    .author-date {
      display: flex;
      flex-direction: column;

      .sep {
        display: none;
      }
    }
  }
}
</style>
