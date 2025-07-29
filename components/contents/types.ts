/* eslint-disable @typescript-eslint/no-unused-vars */
interface messageAi {  
    "input": string;
    "title": string;
    "content": string;
    "duration": number;      
    "date": Date;
    "isOk": boolean;
    "type": string;
    "author": string;
    "idClerk": string;
    
}

interface OpenAiProps {
    "input": string;
    "idClerk": string;
    "author": string;
}

interface ContentProps {
    "type": string;
    "idClerk": string;
    "date": Date | null;
}