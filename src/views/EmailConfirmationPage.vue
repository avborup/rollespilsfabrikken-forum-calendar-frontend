<template>
  <div v-if="isWaiting" class="waiting">
    <h1>Bekræfter email...</h1>
    <LoadingSpinner />
  </div>
  <div v-else-if="confirmationSucceeded" class="success-wrapper">
    <h1>Email bekræftet</h1>
    <p>Din email er nu bekræftet.</p>
    <router-link :to="{ name: 'login' }">Log ind nu!</router-link>
  </div>
  <div v-else class="fail-wrapper">
    <h1>{{ headerMessage }}</h1>
    <p>{{ paragraphMessage }}</p>
    <p v-if="hasToken" class="atmpt-token">{{ attemptedToken }}</p>
  </div>
</template>

<script>
import { InvalidTokenError } from '@/api/errors';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'EmailConfirmationPage',

  components: {
    LoadingSpinner,
  },

  data() {
    const confirmationToken = this.$route.query.token;

    return {
      hasToken: !!confirmationToken,
      confirmationToken,
      headerMessage: '',
      paragraphMessage: '',
      attemptedToken: '',
      isWaiting: true,
      confirmationSucceeded: false,
    };
  },

  methods: {
    async confirmEmail() {
      this.isWaiting = true;
      this.confirmationSucceeded = false;

      if (!this.hasToken) {
        this.headerMessage = 'Manglende bekræftelseskode';
        this.paragraphMessage = 'Det givne URL mangler en bekræftelseskode';
        this.isWaiting = false;
        return;
      }

      try {
        await this.$store.dispatch('auth/confirmEmail', {
          confirmationToken: this.confirmationToken,
        });
        this.confirmationSucceeded = true;
      } catch (err) {
        if (err instanceof InvalidTokenError) {
          this.headerMessage = 'Ugyldig bekræftelseskode';
          this.paragraphMessage = 'Vi beklager, men den opgivne bekræftelseskode er ikke gyldig.';
          this.attemptedToken = this.confirmationToken;
        } else {
          this.headerMessage = 'Der opstod en fejl';
          this.paragraphMessage = 'Vi beklager, men der opstod en ukendt fejl, da vi forsøgte at bekræfte din email.';
          this.attemptedToken = this.confirmationToken;
        }
      }

      this.isWaiting = false;
    },
  },

  mounted() {
    this.confirmEmail();
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

  .atmpt-token {
    font-family: $fonts-monospace;
    font-size: 0.8rem;
  }

  a {
    color: rgb(75, 75, 75);
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
