module.exports = {
  async: true,
  filter: async (title, description, comments, callback) => {
    const OPENAI_API_KEY = "";
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions", 
      {
        body: JSON.stringify({ 
          "model": "gpt-3.5-turbo", 
          "messages": [ 
            {
              "role": "user",
              "content": `The following is information about a pull request:

Title: ${title}
Description: ${description}
Comments: 
  ${comments.map(x => x.content).join("\n\t")}

Please write a message to the maintainer of this repo asking them politely to review this PR. Include a description of this PR in a maximum of two-sentences.`
            }
          ]
        }),
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    );

    const results = await response.json();

    /*
    will return something like
    {
      "id": "chatcmpl-123",
      "object": "chat.completion",
      "created": 1677652288,
      "model": "gpt-3.5-turbo-0613",
      "system_fingerprint": "fp_44709d6fcb",
      "choices": [{
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "Hello there, how may I assist you today?",
        },
        "logprobs": null,
        "finish_reason": "stop"
      }],
      "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
      }
    }
    */
    return results.choices.length > 0
      ? callback(null, results.choices[0].message.content)
      : callback("No response", "");
  }
}
