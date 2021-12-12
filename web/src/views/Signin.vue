<template>
  <div class="signin-page">
    <form @submit.prevent="authenticate">
      <div class="form">
        <div class="title">Welcome</div>
        <div class="subtitle">Sign in to your account!</div>
        <div class="input-container ic1">
          <input name="email" v-model="email" placeholder=" " class="input" />
          <div class="cut cut-short"></div>
          <label for="email" class="placeholder">email</label>
        </div>
        <div class="input-container ic2">
          <input name="password" v-model="password" placeholder=" " type="password" class="input" />
          <div class="cut"></div>
          <label for="password" class="placeholder">password</label>
        </div>
        <input color="primary" class="submit" type="submit" value="Sign in" />
      </div>
    </form>
    <v-img
      :src="require('@/assets/making_art2.svg')"
      max-height="400"
      max-width="400"
      alt="Teacher with a blackboard"
      class="d-none d-md-flex ml-12"
    ></v-img>
    <v-snackbar v-model="snackbar" :color="color" timeout="3000" style="white-space: pre-line">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn :color="btnColor" text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.signin-page {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
}

.form {
  background-color: #272727;
  box-sizing: border-box;
  height: 500px;
  padding: 20px;
  width: 320px;
}

.title {
  color: #eee;
  font-family: sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin-top: 30px;
}

.subtitle {
  color: #eee;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.input-container {
  height: 50px;
  position: relative;
  width: 100%;
}

.ic1 {
  margin-top: 40px;
}

.ic2 {
  margin-top: 30px;
}

.input {
  background-color: #525252;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #fff;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 4px 20px 0;
  width: 100%;
}

.cut {
  background-color: #272727;
  border-radius: 10px;
  height: 20px;
  left: 20px;
  position: absolute;
  top: -20px;
  transform: translateY(0);
  transition: transform 200ms;
  width: 76px;
}

.cut-short {
  width: 50px;
}

.input:focus ~ .cut,
.input:not(:placeholder-shown) ~ .cut {
  transform: translateY(8px);
}

.placeholder {
  color: #ddd;
  font-family: sans-serif;
  left: 20px;
  line-height: 14px;
  pointer-events: none;
  position: absolute;
  transform-origin: 0 50%;
  transition: transform 200ms, color 200ms;
  top: 20px;
}

.input:focus ~ .placeholder,
.input:not(:placeholder-shown) ~ .placeholder {
  transform: translateY(-30px) translateX(10px) scale(0.75);
}

.input:not(:placeholder-shown) ~ .placeholder {
  color: #808097;
}

.input:focus ~ .placeholder {
  color: #dc2f55;
}

.submit {
  background-color: #08d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 38px;
  outline: 0;
  text-align: center;
  width: 100%;
}

.submit:active {
  background-color: #06b;
}
</style>

<script>
export default {
  name: 'App',
  data() {
    return {
      email: '',
      password: '',
      snackbar: false,
      text: '',
      color: 'white',
      btnColor: 'white',
    };
  },
  mounted() {
    this.$on('failedRegistering', (msg) => {
      this.errorMsg = msg;
    });
    this.$on('failedAuthentication', (msg) => {
      this.errorMsg = msg;
    });
  },
  beforeDestroy() {
    this.$off('failedRegistering');
    this.$off('failedAuthentication');
  },
  methods: {
    authenticate() {
      this.$store
        .dispatch('login', { email: this.email, password: this.password })
        .then(() => {
          this.$router.push('/');
        })
        .catch((error) => {
          console.log(error.response.data[0].msg);
          this.text = error.response.data.map((x) => x.loc[0] + ' ' + x.msg).join('\n');
          this.color = 'error';
          this.btnColor = 'red lighten-5';
          this.snackbar = true;
        });
    },
    register() {
      this.$store
        .dispatch('register', { email: this.email, password: this.password })
        .then(() => this.$router.push('/'));
    },
  },
};
</script>
