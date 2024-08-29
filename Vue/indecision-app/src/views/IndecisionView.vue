
<template>
    <div class="bg-gray-100 h-screen flex flex-col max-w-lg mx-auto">
        <div class="bg-green-500 p-4 text-white flex justify-between items-center">
        <span>Byron</span>
    </div>

    <ChatMensajes :messages="messages"/>

    <ChatBox @send-message="onMessage($event)" />
    </div>
    </template>

    <script setup lang="ts">
    import ChatMensajes from '@/components/chat/ChatMensajes.vue';
    import ChatBox from '@/components/chat/ChatBox.vue';
    import { useChat} from '@/composables/useChat';

    const { messages, onMessage} = useChat();

</script>