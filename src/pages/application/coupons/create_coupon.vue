<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-12">
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
                  <generalTab v-if="activeTab == 'general'" />

                  <restrictionTab v-else-if="activeTab == 'restriction'" />

                  <usageTab v-else-if="activeTab == 'usage'" />
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import generalTab from "@/components/application/coupons/create_coupon/general.vue";
import restrictionTab from "@/components/application/coupons/create_coupon/restriction.vue";
import usageTab from "@/components/application/coupons/create_coupon/usage.vue";
export default {
  components: { generalTab, restrictionTab, usageTab },
  title: "Voxo-Create Coupon",
  data() {
    return {
      tabs: [
        {
          name: "General",
          link: "general",
        },
        {
          name: "Restriction",
          link: "restriction",
        },
        {
          name: "Usage",
          link: "usage",
        },
      ],
      activeTab: "general",
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
