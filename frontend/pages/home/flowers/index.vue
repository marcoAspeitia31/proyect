<template>
<Head>
    <Title>Flower Store</Title>
    <Link rel="icon" href="/favicons/5.png">
    </Link>
</Head>
<layout2>
    <HomeFlowerDemoComponentsHomeSlider />
    <HomeFlowerDemoComponentsTopBanner
      :banner="bannersList.filter((item) => item.subtype === 'topbanner')[0].children
    " />
    <HomeFlowerDemoComponentsLatestProducts :products="products" />
    <HomeFlowerDemoComponentsOurCategory :categories="categories" />
    <HomeFlowerDemoComponentsNewOffers :banner="bannersList.filter((item) => item.subtype === 'newoffer')[0]" />
    <HomeFlowerDemoComponentsOurProducts :products="products" />
    <HomeFlowerDemoComponentsBannerWithTimer :banner="bannersList.filter((item) => item.subtype === 'deal')[0]" />
    <HomeFlowerDemoComponentsNewsAndUpdate :banners="
      bannersList.filter((item) => item.subtype === 'newsandupdate')[0].children
    " />
    <HomeFlowerDemoComponentsSubscribe />
    <brand />
    <newsLetterModal />
</layout2>
</template>

<script>
import {
    useBannerStore
} from "~~/store/banners";
import {
    useProductStore
} from "~~/store/products";
import {
    useCategoriesStore
} from '~~/store/categories';
import {
    useClickStore
} from "~~/store/clickEvents";
import layout2 from "~/layout/layouts/layout2.vue";
import brand from "~/layout/elements/banners/brand.vue";
import newsLetterModal from "~/layout/elements/modals/newsLetterModal.vue";
export default {
    components: {
        layout2,
        brand,
        newsLetterModal,
    },
    head() {
        return {
            title: "Flower Store",
            link: [{
                rel: "icon",
                type: "image/x-icon",
                href: "5.png"
            }],
        };
    },
    data() {
        return {
            products: [],
        };
    },
    computed: {

        bannersList() {
            return useBannerStore().data.filter((item) => item.type === "flower")
        },
        productsList() {
            return useProductStore().data
        },
        categories() {
            return useCategoriesStore().data.filter((item) => item.type === "flowers")[0].categories
        },
    },
    methods: {
        productsArray() {
            this.productsList.map((item) => {
                if (item.type === "flower") {
                    this.products.push(item);
                }
            });
        },
    },
    created() {
        useClickStore().toggleNewsLetterModal

        this.productsArray();
        let layoutMode = 'light';
        if (layoutMode === "dark") this.themeCss = "/voxo/css/demo5_dark.css";
        else this.themeCss = "/voxo/css/demo5.css";
    },
    mounted() {
        !useCookie('newsLetterSet').value && useClickStore().toggleNewsLetterModal

    },
};
</script>

<style lang="scss">
@import "@/assets/scss/demo5.scss";
</style>
