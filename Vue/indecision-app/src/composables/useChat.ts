import { ref } from "vue";
import type { ChatMessage } from '@/interfaces/chat-message.int';
import type { YesNoResponse } from "@/interfaces/yes-no.resp";


export const useChat = () => {
    const messages = ref<ChatMessage[]>([]);

    const getResponse = async() => {
        const resp = await fetch('https://yesno.wtf/api');
        const data = (await resp.json())  as YesNoResponse;

        return data;
    }



const onMessage =async ( text: string ) => {
    messages.value.push({
        id: new Date().getTime(),
        itsMine: true,
        message: text,
    });


    if(!text.endsWith('?')) return;
    const {answer, image} = await getResponse();
    messages.value.push({
        id: new Date().getTime(),
        itsMine: false,
        message: answer,
        image: image,
    });

}
    return {
        messages,
        onMessage,

    };

};