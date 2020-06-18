<template>
  <div v-if="user !== null" class="user-profile-wrapper">
    <div>
      <div class="profile-picture">
        <UserAvatar :url="user.avatarUrl" class="avatar" />
        <input
          type="file"
          name="avatar"
          accept="image/jpeg, image/png, image/gif"
          @change="updateAvatarValue"
        >
        <button @click="handleChangeAvatar" type="button">
          Upload profilbillede
          <span class="fas fa-upload icon"></span>
        </button>
        <span v-if="form.errs.avatar.has" class="field-error-msg">
          {{ form.errs.avatar.msg }}
        </span>
      </div>
      <div class="misc-info">
        <p>Profil oprettet d. {{ simpleStringFormat(user.createdAt) }}</p>
      </div>
      <div class="editable-info">
        <div class="form-field" :class="{ 'is-error': form.errs.username.has }">
          <label>Brugernavn</label>
          <input type="text" v-model="form.username">
          <span v-if="form.errs.username.has" class="field-error-msg">
            {{ form.errs.username.msg }}
          </span>
          <button @click="handleChangeUsername" type="button">Ændr brugernavn</button>
        </div>
        <div class="form-field">
          <label>Password</label>
          <button type="button" @click="handleChangePassword">Ændr password</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <LoadingSpinner />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { simpleStringFormat } from '@/dateUtils';
import UserAvatar from '@/components/UserAvatar.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'UserProfileView',

  components: {
    UserAvatar,
    LoadingSpinner,
  },

  data() {
    return {
      form: {
        username: '',
        password: '',
        passwordRepeated: '',
        errs: {
          username: {
            has: false,
            msg: '',
          },
          avatar: {
            has: false,
            msg: '',
          },
        },
        avatarFile: null,
      },
    };
  },

  computed: {
    ...mapState([
      'user',
    ]),
  },

  methods: {
    simpleStringFormat,

    async handleChangeUsername() {
      this.form.errs.username.has = false;

      const { username } = this.form;

      if (username.length === 0) {
        this.form.errs.username.has = true;
        this.form.errs.username.msg = 'Brugernavnet må ikke være tomt';
        return;
      }

      try {
        await this.$store.dispatch('updateUsername', username);
        await this.$store.dispatch('fetchUser');

        this.$dialog.alert(`Dit brugernavn er ændret til ${username}`);
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl, da vi forsøgte at opdatere dit brugernavn.');
      }
    },

    updateAvatarValue(event) {
      const file = event.target.files[0];
      this.form.avatarFile = file;
    },

    async handleChangeAvatar() {
      this.form.errs.avatar.has = false;
      const { avatarFile } = this.form;

      if (!avatarFile) {
        this.form.errs.avatar.has = true;
        this.form.errs.avatar.msg = 'Vælg venligst et billede først';
        return;
      }

      try {
        await this.$store.dispatch('updateUserAvatar', avatarFile);
        this.$store.dispatch('fetchUser');
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl, da vi forsøgte at opdatere dit profilbillede.');
      }
    },

    handleChangePassword() {
      this.$dialog.confirm('Er du sikker på, at du vil ændre dit password? Hvis du fortsætter, vil en email blive sendt til dig, hvor du kan nulstille og oprette et nyt password.', {
        loader: true,
      })
        .then(async (dialog) => {
          const { email } = this.user;

          try {
            await this.$store.dispatch('auth/sendPasswordResetMail', email);
            dialog.close();
            this.$dialog.alert(`En mail er blevet sendt til ${email}, hvor du kan nulstille dit password.`);
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },

  watch: {
    user(userValue) {
      this.form.username = userValue.username;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.user-profile-wrapper > div {
  display: grid;
  grid-template-areas:
    "picture"
    "editable"
    "misc";
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, auto);
  row-gap: 2rem;

  .profile-picture {
    grid-area: picture;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      width: 8rem;
      height: 8rem;
    }

    input[type='file'] {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      width: 100%;
    }

    button {
      width: 100%;
      padding: 0.5rem 0.75rem;
      background-color: $primary-accent;
      color: #fff;
      border: none;
      border-radius: 0.2rem;
      font-family: $fonts;
      font-weight: 600;
      cursor: pointer;

      .icon {
        margin-left: 0.5rem;
      }
    }

    .field-error-msg {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: $err-colour;
    }
  }

  .misc-info {
    grid-area: misc;
    color: #666565;
    font-size: 0.8rem;
  }

  .editable-info {
    grid-area: editable;
    display: flex;
    flex-direction: column;
    align-items: center;

    .form-field {
      display: flex;
      flex-direction: column;
      width: 100%;

      &:not(:last-child) {
        margin-bottom: 2rem;
      }

      p {
        margin: 0.5rem 0 0.3rem 0;
        font-size: 0.9rem;
        color: #666565;
      }

      label {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      input[type='text'], input[type='password'] {
        padding: 0.5rem 0.75rem;
        border-radius: 0.2rem;
        border: 0.1rem solid #f0efef;
        background-color: #f7f7f7;
        font-size: 1rem;
        font-family: $fonts;

        &:focus {
          border-color: $primary-accent;
        }
      }

      &.is-error > input[type='text'], &.is-error > input[type='password'] {
        border-color: $err-colour;
      }

      .field-error-msg {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: $err-colour;
      }
    }

    button {
      align-self: flex-start;
      margin-top: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.2rem;
      border: none;
      background-color: $primary-accent;
      color: #fff;
      cursor: pointer;
      font-family: $fonts;
    }
  }
}

.loading {
  align-items: center;
}

@media (min-width: 550px) {
  main > .user-profile-wrapper > div {
    grid-template-areas:
      "picture  editable"
      "misc     editable";
    grid-template-columns: 11rem 1fr;
    grid-template-rows: auto 1fr;
    row-gap: 2rem;
    column-gap: 4rem;
  }
}

@media (min-width: 700px) {
  main > .user-profile-wrapper > div {
    width: 700px;
  }
}
</style>
