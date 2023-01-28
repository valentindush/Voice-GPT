import { OpenAIApi, Configuration } from 'openai'

const apiKey = "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"

const model = "text-davinci-003"

const configuration = new Configuration({
    apiKey: apiKey
})

const openai = new OpenAIApi(configuration)

export const generateCompletion = async (text: string) => {
    const completion = await openai.createCompletion({
        model: model,
        prompt: text,
    })

    const resultText = completion.data.choices[0].text

    return resultText
}