import { HandleRequest, HttpRequest, HttpResponse, Kv} from "@fermyon/spin-sdk"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const handleRequest: HandleRequest = async function(request: HttpRequest): Promise<HttpResponse> {
  const question = decoder.decode(request.body);
  

  // Define an array of possible Magic 8 Ball responses
  const responses = [
    "Ask again later.",
    "Absolutely!",
    "Unlikely",
    "Simply put, no."
  ];
    
  // Define a function that returns a random element from an array
  function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
    
  let answer = randomElement(responses);
  answer = getOrSetAnswer(question, answer);
  const json = JSON.stringify({
    answer: answer
  });
  return {
      status: 200,
        headers: { "foo": "bar" },
      body: encoder.encode(json).buffer
    }
}

function getOrSetAnswer(question: string, newAnswer: string): string {
  let store = Kv.openDefault();
  let response = "";
  if (store.exists(question)) {
    response = decoder.decode(store.get(question));
    if (response == "Ask again later.") {
      response = newAnswer;
      store.set(question, response);
    }
  } else {
    response = newAnswer;
    store.set(question, response);
  }
  return response;
}
