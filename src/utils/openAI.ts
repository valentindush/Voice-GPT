import { OpenAIApi, Configuration } from 'openai'

const apiKey = "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"


const model = "text-davinci-003"

export const getAPIKey: ()=>string | null= () =>{
    console.log(localStorage.getItem("openAIKey"))
    return localStorage.getItem("openAIKey")
}

const configuration = new Configuration({
    apiKey: apiKey
})

const openai = new OpenAIApi(configuration)

export const generateCompletion = async (text: string) => {

    console.log(apiKey)

    const completion = await openai.createCompletion({
        model: model,
        prompt: text,
    })

    const resultText = completion.data.choices[0].text

    return resultText
}