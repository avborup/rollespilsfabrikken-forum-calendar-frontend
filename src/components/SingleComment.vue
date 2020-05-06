<template>
    <li class="comment" :style="{
      borderLeftColor: colourCycle[depth % colourCycle.length],
    }">
      <div>
        <div class="avatar">
          <img src="/assets/icons/person.svg" alt="Avatar icon">
        </div>
      </div>
      <p class="author-date">
        <span class="author">{{ user.name }}</span>
        <span class="date">
          <span class="sep"> &ndash;</span>
          For {{ toElapsedTimeStr(createdAt) }} siden
        </span>
      </p>
      <div class="comment-body">
        {{ body }}
      </div>
      <ul class="child-comments" v-if="childComments.length > 0">
        <SingleComment
          v-for="childComment in childComments"
          :key="childComment.id"
          v-bind="childComment"
          :depth="depth + 1"
        />
      </ul>
    </li>
</template>

<script>
import { toElapsedTimeStr } from '@/dateUtils';
import { colourCycle } from '@/constants';

const userObjKeys = ['id', 'name', 'avatarUrl'];

export default {
  name: 'SingleComment',

  props: {
    depth: {
      type: Number,
      required: true,
    },
    childComments: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
      validator: provided => userObjKeys.every(key => key in provided),
    },
    id: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },

  data() {
    return {
      colourCycle,
    };
  },

  methods: {
    toElapsedTimeStr,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.comment {
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-template-rows: 2rem 1fr auto;
  grid-template-areas:
    "avatar info"
    "body body"
    "children children";
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  align-items: center;
  border-left-width: 0.15rem;
  border-left-style: solid;
  padding: 0.25rem 0 0.25rem 0.75rem;

  .child-comments {
    grid-area: children;
  }

  &:first-child {
    margin-top: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 2rem;
    height: 2rem;
    grid-area: avatar;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $primary-accent;
    border-radius: 100%;

    img {
      width: 1rem;
      height: 1rem;
    }
  }

  .comment-body {
    grid-area: body;
  }

  .author-date {
    grid-area: info;

    .author {
      text-transform: uppercase;
      color: $primary-accent;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
    }
  }
}
</style>
