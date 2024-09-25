<template>
  <div class="login-section">
    <div class="materialContainer">
      <div class="box">
        <div class="login-title">
          <h2>Forgot Password</h2>
        </div>
        <div class="input">
          <label
            for="emailname"
            :style="[{ 'line-height': selected['email'] ? '18px' : '60px' }]"
            >Enter Email Address</label
          >
          <input
            type="text"
            name="name"
            class="is-invalid"
            id="emailname"
            @focus.prevent="select('email')"
          />
          <span
            class="spin"
            :style="[{ width: selected['email'] ? '100%' : '0%' }]"
          ></span>
        </div>
        <div class="button login button-1">
          <button href="javascript:void(0)" @click.prevent="$router.push('/')">
            <span>Send</span>
            <i class="fa fa-check"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  title: "Voxo-Forgot Password",
  data() {
    return {
      selected: { email: false, empty: false },
    };
  },
  methods: {
    select(textbox) {
      if (textbox === "email") this.selected["email"] = true;
      else this.selected["email"] = false;
    },
  },
};
</script>
