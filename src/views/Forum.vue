<template>
  <div class="forum-content-wrapper">
    <div class="forum">
      <h1>Opslag</h1>
      <ul class="posts">
        <li v-for="post in posts" :key="post.id">
          <div class="avatar">
            <img src="/assets/icons/person.svg" alt="Avatar icon">
          </div>
          <h4 :title="post.title">{{ post.title }}</h4>
          <p class="author-date">
            <span class="author">{{ post.author }}</span>
            <span class="date"> &ndash; {{ toElapsedTimeStr(post.date) }}</span>
          </p>
          <div class="post-info">
            <div class="post-comment-info" :title="`${post.commentCount} kommentarer`">
              <img src="/assets/icons/comment.svg" alt="Comment icon">
              <span class="post-num-comments">{{ post.commentCount }}</span>
            </div>
          </div>
          <div class="post-forum" :title="getForumNameFromId(post.forumId)">
            {{ getForumNameFromId(post.forumId) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// FIXME: ESLint complains that this function does not exist.
// eslint-disable-next-line
import { toElapsedTimeStr } from '@/dateUtils';

export default {
  name: 'Forum',

  computed: {
    ...mapGetters({
      posts: 'getCurrentForumPosts',
      getForumNameFromId: 'getForumNameFromId',
    }),
  },

  methods: {
    toElapsedTimeStr,
  },

  watch: {
    $route(to) {
      const newForumView = to.params.forum;
      this.$store.dispatch('updateCurrentForumView', newForumView);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.forum-content-wrapper {
  overflow: auto;
}

.forum {
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.posts {
  list-style-type: none;

  li {
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
    border: 0.1rem solid rgba(0, 0, 0, 0.05);

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .avatar {
      width: 3rem;
      height: 3rem;
      grid-area: avatar;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $primary-accent;
      border-radius: 100%;

      img {
        width: 1.5rem;
        height: 1.5rem;
      }
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
        text-transform: uppercase;
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

        img {
          height: 1rem;
          margin-right: 0.5rem;
        }
      }
    }

    .post-forum {
      grid-area: forum;
      border-radius: 10rem;
      border: 0.1rem solid $primary-accent;
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
  }
}

@media (min-width: 900px) {
  .forum {
    max-width: 900px;
  }
}

@media (min-width: 1000px) {
  .forum {
    margin-left: 2rem;
  }
}
</style>
