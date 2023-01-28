import React, { useEffect, useState } from 'react'
import { MicOn, Play, Send } from '../../assets/icons'
import { generateCompletion } from '../../utils/openAI'

const Home = () => {

    const [messages, setMessages] = useState<{ message: string, sender: "bot" | "user" }[]>([])



    const [text, setText] = useState('')
    const [recording, setRecording] = useState(false)

    const speak = (text: string) => {

        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[1];
        utterance.rate = 1;
        utterance.pitch = 1;

        synth.speak(utterance);
    }

    let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    const record = () => {
        setText("")
        setRecording(true)
        recognition.start();
        recognition.onresult = (e: any) => {

            let text = ""

            for (let i = e.resultIndex; i < e.results.length; i++) {
                text += ` ${e.results[i][0].transcript}`
                console.log(e.results[i][0].transcript)
            }

            setText(prev => prev + " " + text)
        }

    }

    const stopRecording = async () => {
        await recognition.stop()
        setRecording(false)
    }

    const send = async () => {

        setMessages(prev => [...prev, { message: text, sender: "user" }])
        const responseText = await generateCompletion(text)
        setText("")
        if(responseText){
            setMessages(prev => [...prev, { message: responseText, sender: "bot" }])
        }
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

                    <div className="h-[28rem] bg-gray-100 p-2 mb-3 rounded-md overflow-y-scroll">
                        {messages.map((message, index) => (
                            <div key={index} className={` relative p-2 m-1 rounded-lg max-w-[80%] text-white w-fit ${message.sender === "bot" ? "bg-gray-400 " : "bg-gray-600 mr-0 ml-auto"}`}>{message.message}

                                <button onClick={() => speak(message.message)} title="play" className="absolute w-[10px] h-[10px] -right-1 -bottom-3">
                                    {Play}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full gap-2">
                        <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder='type message' className="outline-none w-full border text-gray-600 border-gray-400 p-2 rounded-xl" />
                        <button onClick={send} title='send' className='p-3 w-[45px] h-[40px] rounded-lg bg-gray-600'>
                            {Send}
                        </button>
                        <button title='start recording' className='w-[40px] h-[40px] border-2 rounded-full flex items-center justify-center border-gray-700 p-2 fill-gray-700 border-opacity-70 scale-[.8]'>
                            {!recording && <div onClick={record} className='w-[40px] h-[40px] flex items-center justify-center'>{MicOn}</div>}
                            {recording && <div onClick={stopRecording} className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>}
                        </button>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Home