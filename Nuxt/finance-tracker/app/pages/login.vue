<template>
  <UCard v-if="!success">
    <template #header> Inicia sesion Finance Tracker </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        :required="true"
        help="You will receive an email with the confirmation link"
      >
        <UInput type="email" placeholder="Email" required v-model="email" />
      </UFormGroup>

      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
        >Sign-in</UButton
      >
    </form>
  </UCard>
  <UCard v-else>
    <template #header> Email has been sent </template>

    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong>{{ email }}</strong> with a link to
        sign-in.
      </p>
      <p><strong>Important:</strong> Este link expira en 5 minutos.</p>
    </div>
  </UCard>
</template>

<script setup>
const success = ref(false);
const email = ref("");
const pending = ref(false);
const { toastError } = useAppToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl;

useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`,
      },
    });

    if (error) {
      toastError({
        title: "Error authenticating",
        description: error.message,
      });
    } else {
      success.value = true;
    }
  } finally {
    pending.value = false;
  }
};
</script>
