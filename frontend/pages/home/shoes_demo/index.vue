<template>
  <Head>
    <Title>Shoes Store</Title>
    <Link rel="icon" href="/favicons/3.png">
    </Link>

  </Head>
  <layout3 :offerCode="offerCode">
    <HomeShoesDemoComponentsHomeSlider  :slides="slides" />
    <customerServices />
    <HomeShoesDemoComponentsTopBanner :banners="bannersList.filter((item) => item.subtype === 'topbanner')[0].banners
      " />
    <HomeShoesDemoComponentsLatestProductsSlider :products="productsList" />
    <HomeShoesDemoComponentsNewOffersBanner :banners="bannersList.filter((item) => item.subtype === 'newoffers')[0]" />
    <HomeShoesDemoComponentsOurCategory />
    <HomeShoesDemoComponentsNewArrivalCarousel :products="productsList" />
    <HomeShoesDemoComponentsDealDayBanner :banner="bannersList.filter((item) => item.subtype === 'dealday')[0]" />
    <subscribe />
    <brand />
    <cookieBar1 />
    <template v-slot:footerRight>
      <footerRight2 />
    </template>
    <newsLetterModal />
  </layout3>
</template>

<script>
import layout3 from "~/layout/layouts/layout3.vue";
import cookieBar1 from "~/layout/elements/cookieBars/cookieBar1.vue";
import footerRight2 from "~/layout/elements/footerElements/footerRight2.vue";
import customerServices from "~/layout/elements/banners/customerServices.vue";
import subscribe from "~/layout/elements/banners/subscribe.vue";
import brand from "~/layout/elements/banners/brand.vue";
import newsLetterModal from "~/layout/elements/modals/newsLetterModal.vue";
import { useBannerStore } from '~~/store/banners';
import { useProductStore } from '~~/store/products';
import { useHomeSliderStore } from '~~/store/homeSliders';
import { useClickStore } from '~~/store/clickEvents';
import { useLayout } from '~~/store/layout'
export default {
  components: {
    layout3,
    cookieBar1,
    footerRight2,
    customerServices,
    subscribe,
    brand,
    newsLetterModal,
  },
  head() {
    return {
      title: "Shoes Store",
      link: [{ rel: "icon", type: "image/x-icon", href: "3.png" }],
    };
  },
  data() {
    return {
      offerCode: "DEF4526",
    };
  },
  computed: {
    bannersList() {
      return useBannerStore().data.filter(
        (item) => item.type === "shoes"
      );
    },
    productsList() {
      return useProductStore().data.filter(
        (item) => item.type === "shoes"
      );
    },
    slides() {
      return useHomeSliderStore().data.filter(
        (item) => item.type === "shoes"
      )[0].slides;
    },
  },
  mounted() {
    !useCookie('newsLetterSet').value &&
      useClickStore().toggleNewsLetterModal()
    useLayout().setPrimaryColor({ primaryColor: "#7520dd" })
  },
  created() {
    let layoutMode = useCookie("layoutType").value || "light";
    if (layoutMode === "dark") this.themeCss = "/voxo/css/demo3_dark.css";
    else this.themeCss = "/voxo/css/demo3.css";
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/demo3.scss";
</style>
