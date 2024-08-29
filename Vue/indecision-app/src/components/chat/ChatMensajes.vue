<template>
    <div  ref='chatRef' class="flex-1 overflow-y-auto p-4">
        <div class="flex flex-col space-y-2">
<!-- Escribe Mensaje Aqui -->
    <ChatBurbuja
        v-for="message in messages" :key="message.id" v-bind="message"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import type { ChatMessage } from '@/interfaces/chat-message.int'
import ChatBurbuja from './ChatBurbuja.vue';


interface Props {
    messages: ChatMessage[];
}
const { messages } = defineProps<Props>();

const chatRef = ref<HTMLDivElement | null>(null);


watch( messages, () => {
    setTimeout(() => {
        chatRef.value?.scrollTo({
        top: chatRef.value.scrollHeight,
        behavior: 'smooth',
    });
    }, 100);
});

// setTimeout(() => {
//     console.log(chatRef.value);
// }, 1000);


// const messagesDiv = document.querySelector('.flex-1');
// messagesDiv?.scrollTo({
//     top: 10000,
//     behavior: 'smooth'

// })

</script>