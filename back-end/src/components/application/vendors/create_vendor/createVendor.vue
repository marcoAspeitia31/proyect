<template>
  <div class="card">
    <div class="card-body">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li
          class="nav-item"
          role="presentation"
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <button
            class="nav-link"
            :class="[{ active: tab.link === activeTab }]"
            id="pills-home-tab"
            type="button"
            @click="changeTab(tab.link)"
          >
            {{ tab.name }}
          </button>
        </li>
      </ul>

      <div class="tab-content" id="pills-tabContent">
        <transition name="translate" mode="out-in">
          <account v-if="activeTab == 'account'" />
          <permissions v-else />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import account from "./account.vue";
import permissions from "./permissions.vue";
export default {
  components: { account, permissions },
  data() {
    return {
      tabs: [
        {
          name: "Account",
          link: "account",
        },
        {
          name: "Permissions",
          link: "permissions",
        },
      ],
      activeTab: "account",
    };
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>
<style>
.translate-enter-active,
.translate-leave-active {
  transition: all 0.5s ease;
}

.translate-enter-from,
.translate-leave-to {
  opacity: 0;
}
</style>
