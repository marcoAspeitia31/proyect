<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-section">
          <div class="materialContainer">
            <div class="box">
              <div class="login-title">
                <h2>Login</h2>
              </div>
              <div class="input">
                <label
                  for="username"
                  :style="[
                    { 'line-height': selected['username'] ? '18px' : '60px' },
                  ]"
                  >Username</label
                >
                <input
                  type="text"
                  name="username"
                  id="username"
                  v-model="values.username"
                  required
                  v-on:blur="handleFocusOut('username')"
                  @focus.prevent="select('username')"
                />
                <span
                  class="spin"
                  :style="[{ width: selected['username'] ? '100%' : '0%' }]"
                ></span>
                <div class="valid-feedback">Please fill the name</div>
              </div>
              <div class="input">
                <label
                  for="password"
                  :style="[
                    { 'line-height': selected['password'] ? '18px' : '60px' },
                  ]"
                  >Password</label
                >
                <input
                  type="password"
                  name="password"
                  id="password"
                  v-model="values.password"
                  v-on:blur="handleFocusOut('password')"
                  @focus.prevent="select('password')"
                />
                <span
                  class="spin"
                  :style="[{ width: selected['password'] ? '100%' : '0%' }]"
                ></span>
                <div class="valid-feedback">Please fill the name</div>
              </div>
              <a
                href="javascript:void(0)"
                @click.prevent="$router.push('/forgot_password')"
                class="pass-forgot"
                >Forgot your password?</a
              >

              <div class="button login">
                <button
                  href="javascript:void(0)"
                  @click.prevent="handleLogin"
                  type="submit"
                >
                  <span>Log In</span>
                  <i class="fa fa-check"></i>
                </button>
              </div>

              <p class="sign-category">
                <span>Or sign in with</span>
              </p>

              <div class="row gx-md-3 gy-3">
                <div class="col-md-6">
                  <a href="https://www.facebook.com/" target="_blank">
                    <div class="social-media fb-media">
                      <img
                        src="@/assets/images/facebook.png"
                        class="img-fluid"
                        alt=""
                      />
                      <h6>Facebook</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6">
                  <a href="https://mail.google.com/" target="_blank">
                    <div class="social-media google-media">
                      <img
                        src="@/assets/images/google.png"
                        class="img-fluid"
                        alt=""
                      />
                      <h6>Google</h6>
                    </div>
                  </a>
                </div>
              </div>

              <p>
                Not a member?
                <nuxt-link
                  to="/register"
                  class="theme-color"
                  href="javascript:void(0)"
                  >Sign up now</nuxt-link
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  title: "Voxo-Log In",
  data() {
    return {
      values: {
        username: "test@gmail.com",
        password: "test@123",
      },
      loginUsername: "test@gmail.com",
      loginPassword: "test@123",
      selected: { username: false, password: false },
      submitted: false,
    };
  },
  methods: {
    handleLogin() {
      console.log(
        "set user",
        this.values.username,
        this.values.password,
        this.loginUsername,
        this.loginPassword
      );
      this.submitted = false;
      if (
        this.values.username === this.loginUsername &&
        this.values.password === this.loginPassword
      ) {
        this.$store.dispatch("functionalities/setUser", { user: true });
        this.$router.push("/");
      }
    },
    handleFocusOut(field) {
      this.values[field] === "" && (this.selected[field] = false);
    },
    select(textbox) {
      this.selected[textbox] = true;
    },
  },
  created() {
    var user = localStorage.getItem("user") || false;
    this.$store.dispatch("functionalities/setUser", { user: user });
    if (user) {
      this.$router.push("/");
    }
  },
  mounted() {
    this.values.username.length != 0
      ? (this.selected.username = true)
      : (this.selected.username = false);
    this.values.password.length != 0
      ? (this.selected.password = true)
      : (this.selected.password = false);
  },
};
</script>

<style></style>
