import React, { useEffect, useRef, useState } from 'react'
import { MicOn, Play, Send } from '../../assets/icons'
import { generateCompletion, getAPIKey } from '../../utils/openAI'

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;


const Home = () => {

    const [messages, setMessages] = useState<{ message: string, sender: "bot" | "user" }[]>([])
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("")

    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<SpeechRecognition | undefined>(undefined);
    const boxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'en-US'
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true

        recognitionInstance.onspeechstart = () => {
          console.log('Speech has been detected.');
        };
    
        recognitionInstance.onspeechend = () => {
          console.log('Speech has stopped.');
          stopRecording();
        };
    
        recognitionInstance.onresult = (event:any) => {
          setTranscript(event.results[0][0].transcript);
          setText(event.results[0][0].transcript)
        };
    
        setRecognition(recognitionInstance);
    
        return () => {
          recognitionInstance.abort();
        };
      }, []);

      const startRecording = () => {
        setTranscript("")
        recognition?.start();
        setIsRecording(true);
      };
    
      const stopRecording = () => {
        recognition?.stop();
        setIsRecording(false);
      };
    

    const sendMessage = async (e: React.FormEvent) => {

        if(text === "" || isRecording) return

        //Get
        setMessages([...messages, { message: text, sender: "user" }])
        setText("")

        //Scroll to bottom
        boxRef.current?.scrollTo(0, boxRef.current.scrollHeight)

        //Send to GPT-3

        setLoading(true)
        const response = await generateCompletion(text)
        setLoading(false)

        //Get response
        setMessages([...messages, { message: `${response}`, sender: "bot" }])

    }


    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        window.speechSynthesis.speak(utterance)
    }

    return (
        <div className='w-screen h-screen bg-white flex items-center justify-center'>

            <div className="">
                <header className='text-center'>
                    <h2 className='text-gray-800 text-xl font-semibold'>Welcome to Voice-GPT</h2>
                    <p className='text-gray-800 mt-4'>Use your microphone to talk to GPT-3  !</p>
                </header>
                <div className="p-3 shadow-md mt-4 rounded-lg w-[600px] border">


                    {/* Messages */}

                    <div className="">{transcript}</div>

                    <div className="h-[28rem] bg-gray-100 p-2 mb-3 rounded-md overflow-y-scroll scroll-smooth" ref={boxRef}>
                        {messages.map((message, index) => (
                            <div key={index} className={` relative p-2 m-1 mt-3 rounded-lg max-w-[80%] break-words w-fit ${message.sender === "bot" ? "bg-slate-500 border text-white " : "bg-teal-800 mr-0 ml-auto text-white"}`}>{message.message}

                                <button onClick={() => speak(message.message)} title="play" className="absolute flex items-center justify-center w-[10px] h-[10px] -right-1 -bottom-2  rounded-full">
                                    {Play}
                                </button>
                            </div>
                        ))}

                        {/* Loading */}

                        {loading && <div className={` relative p-2 m-1 rounded-lg max-w-[80%] text-white w-fit bg-black bg-opacity-10 animate-bounce`}>
                            {"GPT Typing . . ."}
                        </div>}

                    </div>

                    <div className="">
                        <form action="#" onSubmit={(e) => sendMessage(e)} className='flex w-full gap-2'>
                            <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder='type message' className="outline-none w-full border text-gray-600 border-gray-400 p-2 rounded-xl" />
                            <button type='submit' title='send' className='p-3 w-[45px] h-[40px] rounded-lg bg-gray-600'>
                                {Send}
                            </button>
                            <button title='start recording' className='w-[40px] h-[40px] border-2 rounded-full flex items-center justify-center border-gray-700 p-2 fill-gray-700 border-opacity-70 scale-[.8]'>
                                {!isRecording && <div onClick={startRecording} className='w-[40px] h-[40px] flex items-center justify-center'>{MicOn}</div>}
                                {isRecording && <div onClick={stopRecording} className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Home