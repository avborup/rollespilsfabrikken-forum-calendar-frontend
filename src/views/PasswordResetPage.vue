<template>
  <form
    v-if="!isWaiting && hasToken && !resetSucceeded && tokenIsValid && !errorOccurred"
    @submit.prevent="handleChangePassword"
    class="form"
  >
    <div class="form-field" :class="{ 'is-error': form.errs.password.has }">
      <label>Nyt password</label>
      <input type="password" v-model="form.password">
      <span v-if="form.errs.password.has" class="field-error-msg">
        {{ form.errs.password.msg }}
      </span>
    </div>
    <div class="form-field" :class="{ 'is-error': form.errs.passwordRepeated.has }">
      <label>Gentag nyt password</label>
      <input type="password" v-model="form.passwordRepeated">
      <span v-if="form.errs.passwordRepeated.has" class="field-error-msg">
        {{ form.errs.passwordRepeated.msg }}
      </span>
    </div>
    <input type="submit" value="Ændr password">
  </form>
  <div v-else-if="isWaiting" class="waiting">
    <h1 v-if="isConfirming">Tjekker bekræftelseskode</h1>
    <h1 v-else>Ændrer password...</h1>
    <LoadingSpinner />
  </div>
  <div v-else-if="resetSucceeded" class="success-wrapper">
    <h1>Kodeord ændret</h1>
    <p>Du kan nu logge ind med dit nye kodeord.</p>
  </div>
  <div v-else-if="!tokenIsValid" class="fail-wrapper">
    <h1>Ugyldig bekræftelseskode</h1>
    <p>{{ tokenInvalidMsg }}</p>
  </div>
  <div v-else-if="!hasToken" class="fail-wrapper">
    <h1>Manglende bekræftelseskode</h1>
    <p>Det givne URL mangler en bekræftelseskode.</p>
  </div>
</template>

<script>
import { ResourceNotFoundError, ExpiredTokenError } from '@/api/errors';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'ResetPasswordPage',

  components: {
    LoadingSpinner,
  },

  data() {
    const resetToken = this.$route.query.token;

    return {
      hasToken: !!resetToken,
      resetToken,
      email: null,
      isWaiting: true,
      isConfirming: true,
      resetSucceeded: false,
      tokenIsValid: true,
      tokenInvalidMsg: '',
      errorOccurred: false,
      form: {
        password: '',
        passwordRepeated: '',
        errs: {
          password: {
            has: false,
            msg: '',
          },
          passwordRepeated: {
            has: false,
            msg: '',
          },
        },
      },
    };
  },

  async created() {
    if (!this.hasToken) {
      this.isWaiting = false;
      return;
    }

    try {
      const tokenDetails = await this.$store.dispatch('auth/getResetTokenDetails', this.resetToken);
      this.email = tokenDetails.email;
      this.isConfirming = false;
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        this.tokenIsValid = false;
        this.tokenInvalidMsg = 'Vi kunne ikke finde bekræftelseskoden. Måske har du anmodet en ny efter denne blev oprettet.';
      } else if (err instanceof ExpiredTokenError) {
        this.tokenIsValid = false;
        this.tokenInvalidMsg = 'Bekræftelseskoden er udløbet. Anmod en ny for at ændre dit password.';
      } else {
        this.errorOccurred = true;
      }
    }
    this.isWaiting = false;
  },

  methods: {
    async handleChangePassword() {
      this.form.errs.password.has = false;
      this.form.errs.passwordRepeated.has = false;

      const { password, passwordRepeated } = this.form;

      if (password.length < 8) {
        this.form.errs.password.has = true;
        this.form.errs.password.msg = 'Det nye password skal være min. 8 tegn langt';
      }

      if (password !== passwordRepeated) {
        this.form.errs.passwordRepeated.has = true;
        this.form.errs.passwordRepeated.msg = 'De to passwords stemmer ikke overens';
      }

      if (this.form.errs.password.has || this.form.errs.passwordRepeated.has) {
        return;
      }

      this.isWaiting = true;
      try {
        await this.$store.dispatch('auth/changePassword', {
          resetToken: this.resetToken,
          email: this.email,
          newPassword: password,
          passwordRepeated,
        });
        this.resetSucceeded = true;
      } catch (err) {
        this.errorOccurred = true;
      }
      this.isWaiting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.fail-wrapper, .success-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 1.6rem;
  }

  p {
    font-size: 1rem;
  }

  a {
    color: rgb(75, 75, 75);
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;

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

    input[type='password'] {
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

    &.is-error > input[type='password'] {
      border-color: $err-colour;
    }

    .field-error-msg {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: $err-colour;
    }
  }

  input[type='submit'] {
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.2rem;
    border: none;
    background-color: $primary-accent;
    color: #fff;
    cursor: pointer;
  }
}

.waiting {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
}
</style>
