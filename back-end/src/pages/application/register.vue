<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <!-- Sign Up Section Start -->
        <div class="login-section">
          <div class="materialContainer">
            <div class="box">
              <div class="login-title">
                <h2>Register</h2>
              </div>

              <div class="input">
                <label for="name" :style="[
                    { 'line-height': selected['name'] ? '18px' : '60px' },
                  ]">Name</label>
                <input type="text" name="name" id="name" @focus.prevent="select('name')"
                  v-on:blur="handleFocusOut('name')" v-model="values.name" />
                <span class="spin" :style="[{ width: selected['name'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="emailname" :style="[
                    { 'line-height': selected['email'] ? '18px' : '60px' },
                  ]">Email Address</label>
                <input type="text" name="name" id="emailname" @focus.prevent="select('email')"
                  v-on:blur="handleFocusOut('email')" v-model="values.email" />
                <span class="spin" :style="[{ width: selected['email'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="pass" :style="[
                    { 'line-height': selected['password'] ? '18px' : '60px' },
                  ]">Password</label>
                <input type="password" name="pass" id="pass" @focus.prevent="select('password')"
                  v-on:blur="handleFocusOut('password')" v-model="values.password" />
                <span class="spin" :style="[{ width: selected['password'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="compass" :style="[
                    {
                      'line-height': selected['confirmPassword']
                        ? '18px'
                        : '60px',
                    },
                  ]">Confirm Password</label>
                <input type="password" name="pass" id="compass" @focus.prevent="select('confirmPassword')"
                  v-on:blur="handleFocusOut('confirmPassword')" v-model="values.confirmPassword" />
                <span class="spin" :style="[
                    { width: selected['confirmPassword'] ? '100%' : '0%' },
                  ]"></span>
              </div>

              <div class="button login">
                <button @click.prevent="$router.push('/')">
                  <span>Sign Up</span>
                  <i class="fa fa-check"></i>
                </button>
              </div>

              <p class="sign-category">
                <span>Or sign up with</span>
              </p>

              <div class="row gx-md-3 gy-3">
                <div class="col-md-6">
                  <a href="javascript:void(0)">
                    <div class="social-media fb-media">
                      <img src="@/assets/images/facebook.png" class="img-fluid blur-up lazyload" alt="" />
                      <h6>Facebook</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6">
                  <a href="javascript:void(0)">
                    <div class="social-media google-media">
                      <img src="@/assets/images/google.png" class="img-fluid blur-up lazyload" alt="" />
                      <h6>Google</h6>
                    </div>
                  </a>
                </div>
              </div>
              <p>
                <router-link to="/log_in" href="javascript:void(0)" class="theme-color">Already have an account?
                </router-link>
              </p>
            </div>
          </div>
        </div>
        <!-- Sign Up Section End -->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    title: "Voxo-Register",
    data() {
      return {
        values: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
        selected: {
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        },
      };
    },
    methods: {
      select(textbox) {
        this.selected[textbox] = true;
      },
      handleFocusOut(field) {
        this.auth[field] === "" && (this.selected[field] = false);
      },
    },
  };
</script>

<style></style>