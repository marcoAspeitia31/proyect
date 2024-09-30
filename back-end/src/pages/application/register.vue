<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <!-- Sign Up Section Start -->
        <div class="login-section">
          <div class="materialContainer">
            <div class="box">
              <div class="login-title">
                <h2>Registrar</h2>
              </div>

              <div class="input">
                <label for="name" :style="[ { 'line-height': selected['name'] ? '18px' : '60px' }]">Nombre</label>
                <input type="text" name="name" id="name" @focus.prevent="select('name')"
                  v-on:blur="handleFocusOut('name')" v-model="values.name" />
                <span class="spin" :style="[{ width: selected['name'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="emailname" :style="[ { 'line-height': selected['email'] ? '18px' : '60px' }]">Correo electrónico</label>
                <input type="email" name="email" id="emailname" @focus.prevent="select('email')"
                  v-on:blur="handleFocusOut('email')" v-model="values.email" />
                <span class="spin" :style="[{ width: selected['email'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="pass" :style="[ { 'line-height': selected['password'] ? '18px' : '60px' }]">Contraseña</label>
                <input type="password" name="pass" id="pass" @focus.prevent="select('password')"
                  v-on:blur="handleFocusOut('password')" v-model="values.password" />
                <span class="spin" :style="[{ width: selected['password'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="input">
                <label for="compass" :style="[ { 'line-height': selected['confirmPassword'] ? '18px' : '60px' }]">Confirmar Contraseña</label>
                <input type="password" name="confirmPassword" id="compass" @focus.prevent="select('confirmPassword')"
                  v-on:blur="handleFocusOut('confirmPassword')" v-model="values.confirmPassword" />
                <span class="spin" :style="[ { width: selected['confirmPassword'] ? '100%' : '0%' }]"></span>
              </div>

              <!-- Campo para rol -->
              <div class="input">
                <select name="role" id="role" v-model="values.role" @focus="select('role')" @blur="handleFocusOut('role')">
                  <option value="" disabled selected>Selecciona un rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Sucursal">Sucursal</option>
                </select>
                <span class="spin" :style="[{ width: selected['role'] ? '100%' : '0%' }]"></span>
              </div>

              <!-- Campo para estatus -->
              <div class="input">
                <select name="status" id="status" v-model="values.status" @focus="select('status')" @blur="handleFocusOut('status')">
                  <option value="" disabled selected>Selecciona un estatus</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <span class="spin" :style="[{ width: selected['status'] ? '100%' : '0%' }]"></span>
              </div>

              <div class="button login">
                <button @click.prevent="registerUser">
                  <span>Registrar</span>
                  <i class="fa fa-check"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
        <!-- Sign Up Section End -->
      </div>
    </div>
  </div>
</template>

<script>
import { db, ref, set } from '../../../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import bcrypt from 'bcryptjs';

export default {
  title: "SK-Registrar",
  data() {
    return {
      values: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        status: ""
      },
      selected: {
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        role: false,
        status: false
      },
    };
  },
  methods: {
    select(textbox) {
      this.selected[textbox] = true;
    },
    handleFocusOut(field) {
      this.values[field] === "" && (this.selected[field] = false);
    },
    async registerUser() {
      const { name, email, password, confirmPassword, role, status } = this.values;
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRef = ref(db, 'users/' + email.replace('.', '_'));
        await set(userRef, {
          email,
          name,
          hashedPassword,
          role,
          status
        });

        alert('Usuario registrado con éxito');
        this.$router.push('/');
      } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        alert('Hubo un error al registrar el usuario.');
      }
    },
  },
};
</script>

<style>
.input {
  margin-bottom: 20px;
  position: relative;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

label {
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

</style>
