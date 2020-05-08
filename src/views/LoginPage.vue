<template>
  <div class="login-wrapper">
    <h1>Log ind {{ isAuthenticated }}</h1>
    <p v-if="isInvalidLogin" class="login-error">Ugyldigt brugernavn eller password!</p>
    <form @submit="handleSubmit" class="login-form">
      <div class="form-field" :class="{ 'is-error': emailHasError }">
        <label for="form-email">Email</label>
        <input type="text" v-model="email" name="email" id="form-email">
        <span v-if="emailHasError" class="field-error-msg">{{ emailMessage }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': passwordHasError }">
        <label for="form-password">Password</label>
        <input type="password" v-model="password" name="password" id="form-password">
        <span class="field-error-msg">{{ passwordMessage }}</span>
      </div>
      <input class="form-submit" type="submit" value="Log ind">
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UnauthorizedError } from '@/api/errors';

export default {
  name: 'LoginPage',

  data() {
    return {
      email: '',
      emailHasError: false,
      emailMessage: '',
      password: '',
      passwordMessage: '',
      passwordHasError: false,
      isInvalidLogin: false,
    };
  },

  methods: {
    async handleSubmit(event) {
      event.preventDefault();
      this.isInvalidLogin = false;

      this.emailHasError = this.email.length === 0;
      this.emailMessage = this.emailHasError ? 'Indtast venligst en emailadresse' : '';

      this.passwordHasError = this.password.length === 0;
      this.passwordMessage = this.passwordHasError ? 'Indtast venligst et password' : '';

      if (this.emailHasError || this.passwordHasError) {
        return;
      }

      const { email, password } = this;
      try {
        await this.$store.dispatch('auth/login', { email, password });
      } catch (err) {
        this.isInvalidLogin = err instanceof UnauthorizedError;

        if (!this.isInvalidLogin) {
          alert('Der opstod en fejl!');
        }
      }
    },
  },

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
  },

  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        // For now, this is simply a console log. This will be used to redirect the user
        // once they are authenticated, but this will be implemented at a later time.
        console.log('User is now authenticated.');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

$err-colour: #e90000;

.login-wrapper {
  padding: 2rem 1rem;
  width: 100%;

  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;

    .form-field {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 1rem;

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

    .form-submit {
      width: 5rem;
      margin-top: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.2rem;
      border: none;
      background-color: $primary-accent;
      color: #fff;
      cursor: pointer;
    }
  }

  .login-error {
    color: $err-colour;
    padding-bottom: 1rem;
  }
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

@media (min-width: 300px) {
  .login-wrapper {
    width: 300px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
