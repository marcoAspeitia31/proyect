
import { createRouter, createWebHistory } from "vue-router";
import layout1 from "../layouts/layout/layout1.vue";

import dashboard from "../pages/dashboard.vue";
import allUsers from "../pages/general/users/all_users.vue";
import add_new_user from "../pages/general/users/add_new_user.vue";
import order_list from "../pages/application/orders/order_list.vue";
import order_detail from "../pages/application/orders/order_detail.vue";
import order_tracking from "../pages/application/orders/order_tracking.vue";
import vendor_list from "../pages/application/vendors/vendor_list.vue";
import create_vendor from "../pages/application/vendors/create_vendor.vue";
import translation from "../pages/application/localization/translation.vue";
import currency_rate from "../pages/application/localization/currency_rate.vue";
import taxes from "../pages/application/localization/taxes.vue";
import products from "../pages/application/product/products.vue";
import add_product from "../pages/application/product/add_new_product.vue";
import menu_lists from "../pages/application/menus/menu_lists.vue";
import create_menu from "../pages/application/menus/create_menu.vue";
import coupon_list from "../pages/application/coupons/coupon_list.vue";
import create_coupon from "../pages/application/coupons/create_coupon.vue";
import product_review from "../pages/application/product_review.vue";
import invoice from "../pages/application/invoice.vue";
import support_ticket from "../pages/application/support_ticket.vue";
import profile_setting from "../pages/application/settings/profile_setting.vue";
import reports from "../pages/application/reports.vue";
import list_page from "../pages/application/list_page.vue";
import log_in from "../pages/application/log_in.vue";
import forgot_password from "../pages/application/forgot_password.vue";
import register from "../pages/application/register.vue";
import RolsCrud from "@/components/general/users/rolsCrud.vue";
import SucursalesCrud from '@/pages/application/store/SucursalesCrud.vue';
import allSucursal from "@/components/allSucursal.vue";


// Declaración de las rutas
const routes = [
  {
    path: "/",
    name: "dashboard",
    component: dashboard,
    meta: { layout: layout1, breadcrumb: { type: 0 } },
  },
  {
    path: "/all_users",
    name: "allUsers",
    component: allUsers,
    meta: {
      layout: layout1,
      breadcrumb: { type: 1, title: "Total de usuarios", buttonPath: "/add_new_user" },
      roles: ["Administrador", "Sistemas", "Sucursal"]
    },
  },
  {
    path: "/add_new_user",
    name: "add_new_user",
    component: add_new_user,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Añadir usuario" },
      roles: ["Administrador", "Sistemas"]
    },
  },
  {
    path: "/order_list",
    name: "order_list",
    component: order_list,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Order List" } },
  },
  {
    path: "/order_detail",
    name: "order_detail",
    component: order_detail,
    meta: {
      layout: layout1,
      breadcrumb: {
        type: 3,
        title: "Order #36648",
        lis: ["October 21, 2021 at 9:08 pm", "6 items", "Total $5,882.00"],
      },
    },
  },
  {
    path: "/order_tracking",
    name: "order_tracking",
    component: order_tracking,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Order Tracking" } },
  },
  {
    path: "/vendor_list",
    name: "vendor_list",
    component: vendor_list,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Vendor List" } },
  },
  {
    path: "/create_vendor",
    name: "create_vendor",
    component: create_vendor,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Create Vendor" } },
  },
  {
    path: "/translation",
    name: "translation",
    component: translation,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Translation" } },
  },
  {
    path: "/currency_rate",
    name: "currency_rate",
    component: currency_rate,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Currency Rates" } },
  },
  {
    path: "/taxes",
    name: "taxes",
    component: taxes,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Taxes" } },
  },
  {
    path: "/products",
    name: "products",
    component: products,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Products" } },
  },
  {
    path: "/add_product",
    name: "add_product",
    component: add_product,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Add Product" } },
  },
  {
    path: "/menu_lists",
    name: "menu_lists",
    component: menu_lists,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Menu Lists" } },
  },
  {
    path: "/create_menu",
    name: "create_menu",
    component: create_menu,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Create Menu" } },
  },
  {
    path: "/coupon_list",
    name: "coupon_list",
    component: coupon_list,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Coupon List" } },
  },
  {
    path: "/create_coupon",
    name: "create_coupon",
    component: create_coupon,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Create Coupon" } },
  },
  {
    path: "/product_review",
    name: "product_review",
    component: product_review,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Product Review" } },
  },
  {
    path: "/invoice",
    name: "invoice",
    component: invoice,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Invoice" } },
  },
  {
    path: "/support_ticket",
    name: "support_ticket",
    component: support_ticket,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Support Ticket" } },
  },
  {
    path: "/profile_setting",
    name: "profile_setting",
    component: profile_setting,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Profile Setting" },
    },
  },
  {
    path: "/reports",
    name: "reports",
    component: reports,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Report" },
    },
  },
  {
    path: "/list_page",
    name: "list_page",
    component: list_page,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "List Page" } },
  },
  {
    path: "/log_in",
    name: "log_in",
    component: log_in,
  },
  {
    path: "/forgot_password",
    name: "forgot_password",
    component: forgot_password,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  
  {
    path: "/rols_Crud",
    name: "rolsCrud",
    component: RolsCrud,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Gestionar Roles" }, roles: ["Administrador", "Sistemas"] },
  },
  {
    path: '/gestion-sucursales',
    name: 'SucursalesCrud',
    component: SucursalesCrud,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Gestion Sucurales" } },
  },
  {
    path: "/all_sucursal",
    name: "allSucursal",
    component: allSucursal,
    meta: {
      layout: layout1, breadcrumb: { type: 2, title: "Total Sucursales" }, roles: ["Administrador", "Sistemas","Sucursal"]
    }
  }
];

// Configuración del router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("user"); // Verifica si el usuario está autenticado
  let user = null;

  try {
    user = isAuthenticated ? JSON.parse(isAuthenticated) : null;
  } catch (e) {
    console.error("Error al parsear el usuario desde localStorage:", e);
  }

  // Si no está autenticado y la ruta no es login o forgot_password, redirige a login
  if (!isAuthenticated && to.name !== "log_in" && to.name !== "forgot_password") {
    next({ name: "log_in" });
  } else if (to.meta.roles && user && !to.meta.roles.includes(user.rol)) {
    // Si el rol del usuario no tiene acceso a la ruta solicitada, redirige al dashboard
    next({ name: "dashboard" });
  } else {
    // Permite la navegación
    next();
  }
});

export default router;