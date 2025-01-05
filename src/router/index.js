import { createRouter, createWebHistory } from "vue-router";
import layout1 from "../layouts/layout/layout1.vue";

import dashboard from "../pages/dashboard.vue";
import allUsers from "@/components/general/users/allUsers/listUser.vue";
import add_new_user from "../pages/general/users/add_new_user.vue";
import order_list from "../pages/application/orders/order_list.vue";
import order_detail from "../pages/application/orders/order_detail.vue";
import order_tracking from "../pages/application/orders/order_tracking.vue";
import vendor_list from "../pages/application/vendors/vendor_list.vue";
import create_vendor from "../pages/application/vendors/create_vendor.vue";
import profile_setting from "../pages/application/settings/profile_setting.vue";
import log_in from "@/components/auth/log_in.vue";
import forgot_password from "@/components/auth/forgot_password.vue";
import register from "../pages/application/register.vue";
import RolsCrud from "@/components/general/users/rolsCrud.vue";
import SucursalesCrud from "@/pages/application/store/SucursalesCrud.vue";
import allSucursal from "@/components/allSucursal.vue";
import listUser from "@/components/general/users/allUsers/listUser.vue";
import viewUser from "@/pages/general/users/viewUser.vue";
import ListSucursal from "@/components/listSucursal.vue";
import editPolygon from "@/pages/poligonos/editPolygon.vue";
import createPolygon from "@/pages/poligonos/createPolygon.vue";
import viewPolygon from "@/pages/poligonos/viewPolygon.vue";
import order_Shop from "@/components/application/orders/order_shop/order_Shop.vue";
import client_Directory from "@/components/application/orders/order_shop/client_Directory.vue";
import create_Client from "@/components/application/orders/order_shop/create_Client.vue";
import edit_Client from "@/components/application/orders/order_shop/edit_Client.vue";
import order_Search from "@/components/application/orders/order_cart/order_Search.vue";
import order_Continue from "@/components/application/orders/order_cart/oder_Continue.vue";
import order_CheckCart from "@/components/application/orders/order_cart/order_CheckCart.vue";

// Declaración de las rutas
const routes = [
  {
    path: "/",
    name: "dashboard",
    component: dashboard,
    meta: { layout: layout1, breadcrumb: { type: 0 } },
  },
  {
    path: "/user/all-users",
    name: "allUsers",
    component: allUsers,
    meta: {
      layout: layout1,
      breadcrumb: {
        type: 1,
        title: "Total de usuarios",
        buttonPath: "/user/add-new-user",
      },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
  {
    path: "/user/add-new-user",
    name: "add_new_user",
    component: add_new_user,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Añadir usuario" },
      roles: ["Administrador", "Sistemas"],
    },
  },
  {
    path: "/user/view-user",
    name: "viewUser",
    component: viewUser,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Detalles de usuario" },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
  {
    path: "/orders/order-list",
    name: "order_list",
    component: order_list,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Lista de Pedidos" },
    },
  },
  {
    path: "/orders/order-detail/:orderUid",
    name: "order_detail",
    component: order_detail,
    meta: {
      layout: layout1,
      breadcrumb: {
        type: 2,
        title: "Informacion del Pedido",
      },
    },
  },
  {
    path: "/orders/order-tracking/:orderUid",
    name: "order_tracking",
    component: order_tracking,
    props: true,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Order Tracking" } },
  },
  {
    path: "/orders/order-shop",
    name: "order_shop",
    component: order_Shop,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Crear Pedido" },
    },
  },
  {
    path: "/orders/order-search/:customerUID",
    name: "order_search",
    component: order_Search,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Buscar producto" },
    },
  },
  {
    path: "/orders/order-continue",
    name: "order_continue",
    component: order_Continue,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Continuar Pedido" },
    },
  },
  {
    path: "/orders/cart/:customerUID",
    name: "cart",
    component: order_CheckCart,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2 },
    },
  },
  {
    path: "/orders/client-directory",
    name: "client_Directory",
    component: client_Directory,
    meta: {
      layout: layout1,
      breadcrumb: {
        type: 1,
        title: "Directorio de clientes",
        buttonPath: "/orders/create-client",
      },
    },
  },
  {
    path: "/orders/create-client",
    name: "create-client",
    component: create_Client,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Crear cliente" },
    },
  },
  {
    path: "/orders/edit-client",
    name: "edit-client",
    component: edit_Client,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Editar cliente" },
    },
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
    path: "/profile_setting",
    name: "profile_setting",
    component: profile_setting,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Profile Setting" },
    },
  },
  {
    path: "/log-in",
    name: "log_in",
    component: log_in,
  },

  {
    path: "/forgot-password",
    name: "forgot_password",
    component: forgot_password,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  {
    path: "/user-list",
    name: "userList",
    component: listUser,
    meta: {
      layout: layout1,
      breadcrumb: {
        type: 2,
        title: "Total de usuarios",
        buttonPath: "/user_list",
      },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
  {
    path: "/rols_Crud",
    name: "rolsCrud",
    component: RolsCrud,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Gestionar Roles" },
      roles: ["Administrador", "Sistemas"],
    },
  },
  {
    path: "/stores/create-store",
    name: "SucursalesCrud",
    component: SucursalesCrud,
    meta: { layout: layout1, breadcrumb: { type: 2, title: "Crear Sucursal" } },
  },
  {
    path: "/stores/all-store",
    name: "allSucursal",
    component: allSucursal,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Total Sucursales" },
      roles: ["Administrador", "Sistemas"],
    },
  },
  {
    path: "/stores/list-store",
    name: "listSucursal",
    component: ListSucursal,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Directorio De Sucursales" },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
  {
    path: "/polygons/edit-polygon/:polygonId",
    name: "editPolygon",
    component: editPolygon,
    props: true,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Editar Poligonos" },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },

  {
    path: "/polygons/create-polygon/:branchId",
    name: "createPolygon",
    component: createPolygon,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Crear Poligono" },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
  {
    path: "/polygons/view-polygon/",
    name: "viewPolygon",
    component: viewPolygon,
    meta: {
      layout: layout1,
      breadcrumb: { type: 2, title: "Ver Poligono" },
      roles: ["Administrador", "Sistemas", "Sucursal"],
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("user");
  let user = null;

  try {
    user = isAuthenticated ? JSON.parse(isAuthenticated) : null;
  } catch (e) {
    console.error("Error al parsear el usuario desde localStorage:", e);
    user = null;
  }

  if (
    !isAuthenticated &&
    to.name !== "log_in" && // Redirige usando el nombre de la ruta
    to.name !== "forgot_password" &&
    to.name !== "register"
  ) {
    next({ name: "log_in" }); // Redirige al nombre de la ruta
  } else if (to.meta.roles && user && !to.meta.roles.includes(user.rol)) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
