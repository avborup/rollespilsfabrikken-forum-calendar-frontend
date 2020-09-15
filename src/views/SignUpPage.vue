<template>
  <div class="signup-wrapper">
    <h1>Opret ny bruger</h1>
    <form @submit="handleSubmit" class="signup-form">
      <div class="form-field" :class="{ 'is-error': usernameHasError }">
        <label for="form-username">Brugernavn</label>
        <input type="text" v-model="username" name="username">
        <span v-if="usernameHasError" class="field-error-msg">{{ usernameMessage }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': emailHasError }">
        <label for="form-email">Email</label>
        <input type="text" v-model="email" name="email">
        <span v-if="emailHasError" class="field-error-msg">{{ emailMessage }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': emailConfHasError }">
        <label for="form-email">Gentag email</label>
        <input type="text" v-model="emailConf" name="email-conf">
        <span v-if="emailConfHasError" class="field-error-msg">{{ emailConfMessage }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': passwordHasError }">
        <label for="form-password">Password (min. 8 tegn)</label>
        <input type="password" v-model="password" name="password">
        <span v-if="passwordHasError" class="field-error-msg">{{ passwordMessage }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': passwordConfHasError }">
        <label for="form-password-confirmation">Gentag password</label>
        <input type="password" v-model="passwordConf" name="password-conf">
        <span v-if="passwordConfHasError" class="field-error-msg">{{ passwordConfMessage }}</span>
      </div>
      <p v-if="isLoadingQuestion">Henter sikkerhedsspørgsmål...</p>
      <input class="form-submit" type="submit" value="Opret bruger">
    </form>
    <input
      v-if="sentEmail.length > 0"
      type="button"
      value="Send bekræftelsesmail igen"
      @click="resendEmail"
      :title="sentEmail"
      class="resend-mail"
    >
  </div>
</template>

<script>
import { InvalidEmailError, EmailAlreadyTakenError, WrongAnswerError } from '@/api/errors';

export default {
  name: 'SignUpPage',

  data() {
    return {
      username: '',
      email: '',
      password: '',
      usernameHasError: false,
      emailHasError: false,
      emailConfHasError: false,
      passwordHasError: false,
      passwordConfHasError: false,
      emailConf: '',
      passwordConf: '',
      usernameMessage: '',
      emailMessage: '',
      emailConfMessage: '',
      passwordMessage: '',
      passwordConfMessage: '',
      isLoadingQuestion: false,
      sentEmail: '',
    };
  },

  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      this.usernameHasError = false;
      this.emailHasError = false;
      this.emailConfHasError = false;
      this.passwordHasError = false;
      this.passwordConfHasError = false;

      if (this.username.length === 0) {
        this.usernameHasError = true;
        this.usernameMessage = 'Brugernavn må ikke stå tomt';
      }

      if (this.email.length === 0) {
        this.emailHasError = true;
        this.emailMessage = 'Email må ikke stå tom';
      }

      if (this.emailConf.length === 0) {
        this.emailConfHasError = true;
        this.emailConfMessage = 'Gentag venligst din email';
      } else if (this.emailConf !== this.email) {
        this.emailConfHasError = true;
        this.emailConfMessage = 'De to mailadresser stemmer ikke overens';
      }

      if (this.password.length === 0) {
        this.passwordHasError = true;
        this.passwordMessage = 'Password må ikke være tomt';
      } else if (this.password.length < 8) {
        this.passwordHasError = true;
        this.passwordMessage = 'Password skal være minimum 8 tegn langt';
      }

      if (this.passwordConf.length === 0) {
        this.passwordConfHasError = true;
        this.passwordConfMessage = 'Gentag venligst dit password';
      } else if (this.passwordConf !== this.password) {
        this.passwordConfHasError = true;
        this.passwordConfMessage = 'De to passwords stemmer ikke overens';
      }

      if (this.usernameHasError || this.emailHasError || this.emailConfHasError
          || this.passwordHasError || this.passwordConfHasError) {
        return;
      }

      this.isLoadingQuestion = true;
      let securityQuestion = null;
      let securityQuestionErrored = false;
      try {
        securityQuestion = await this.$store.dispatch('auth/getSecurityQuestion');
      } catch (err) {
        securityQuestionErrored = true;
        this.$dialog.alert('Vi beklager, men der opstod en fejl, da vi forsøgte at hente et sikkerhedsspørgsmål.');
      }
      this.isLoadingQuestion = false;

      if (securityQuestionErrored) {
        return;
      }

      this.$dialog.prompt({
        title: 'Sikkerhedsspørgsmål',
        body: securityQuestion.question,
      }, {
        promptHelp: 'Skriv dit svar i nedenstående felt og klik "[+:okText]"',
        loader: true,
      })
        .then((dialog) => {
          let answer = dialog.data;

          // For some reason, the library returns null if the user presses enter
          // rather than the button. This quick fix works around that.
          if (answer === null) {
            const el = document.getElementById('dg-input-elem');
            answer = el.value;
          }

          this.$store.dispatch('auth/signUp', {
            username: this.username,
            email: this.email,
            emailConf: this.emailConf,
            password: this.password,
            passwordConf: this.passwordConf,
            securityQuestionId: securityQuestion.id,
            securityQuestionAnswer: answer,
          })
            .then(() => {
              // We will save the sent email as another variable not bound to a v-model
              // to prevent resending to a wrong email.
              this.sentEmail = this.email;
              this.$dialog.alert(`En bekræftelsesmail er blevet sendt til ${this.sentEmail}. Åben den og klik på linket for at fuldføre kontooprettelsen.`);
            })
            .catch((err) => {
              let knownError = false;

              if (err instanceof WrongAnswerError) {
                knownError = true;
                this.$dialog.alert(`Svaret "${answer}" var forkert! Du kan prøve igen.`);
              }

              if (err instanceof EmailAlreadyTakenError) {
                knownError = true;
                this.emailHasError = true;
                this.emailMessage = 'Denne email er allerede optaget';
              }

              if (err instanceof InvalidEmailError) {
                knownError = true;
                this.emailHasError = true;
                this.emailMessage = 'Denne email er ugyldig';
              }

              if (!knownError) {
                this.$dialog.alert('Vi beklager, men der opstod en fejl.');
              }
            });

          dialog.close();
        })
        .catch(() => {});
    },

    resendEmail() {
      this.$store.dispatch('auth/resendEmail', this.sentEmail);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.signup-wrapper {
  width: 100%;

  .signup-form {
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
        border: 2px solid #f0efef;
        background-color: #f7f7f7;
        font-size: 1rem;
        font-family: $fonts;

        &:focus {
          border-color: $primary-accent;
          outline: none;
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
  }

  .signup-error {
    color: $err-colour;
    padding-bottom: 1rem;
  }
}

.form-submit, .resend-mail {
  width: 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.2rem;
  border: none;
  background-color: $primary-accent;
  color: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
}

.resend-mail {
  width: 12rem;
  display: block;
  margin: 0 auto;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

@media (min-width: 400px) {
  main > .signup-wrapper {
    width: 400px;
  }
}
</style>
