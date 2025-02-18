import requests
import sseclient
import json
import sys
import os 

auth_token = os.getenv('auth_token')

messages = [
{"role": "system", "content": "You are a helpful, concise assistant."}, 
]

model = 'gpt-4o-mini'

intro = """
  ______    __    __       __  ___________  _______    _______  ___________  
 /" _  "\  /" |  | "\     /""\("     _   ")/" _   "|  |   __ "\("     _   ") 
(: ( \___)(:  (__)  :)   /    \)__/  \\__/(: ( \___)  (. |__) :))__/  \\__/  
 \/ \      \/      \/   /' /\  \  \\_ /    \/ \       |:  ____/    \\_ /     
 //  \ _   //  __  \\  //  __'  \ |.  |    //  \ ___  (|  /        |.  |     
(:   _) \ (:  (  )  :)/   /  \\  \\:  |   (:   _(  _|/|__/ \       \:  |     
 \_______) \__|  |__/(___/    \___)\__|    \_______)(_______)       \__|     
                                                                             
\n\nmodel: """
intro += model + "\n\n"
print(intro)                                                                             

while True:
  try: 
    input_message = input('\n-----\nUser:\n-----\n')
  except KeyboardInterrupt:
    print('\n----------\nAssistant:\n----------')
    print('Good bye!')
    sys.exit()
  messages.append({"role": "user", "content": input_message})
  print('\n')

  url = 'https://api.openai.com/v1/chat/completions'
  headers = {
    "Content-Type": "application/json",
    "Authorization": auth_token
  }
  data = {
    "model": model,
    "messages": messages,
    "stream": True
  }

  request = requests.post(url, headers=headers, json=data, stream=True)
  client = sseclient.SSEClient(request)
  full_response = ''
  print('----------\nAssistant:\n----------')
  for event in client.events():
    if event.data != '[DONE]':
      data = json.loads(event.data)
      finish_reason = data['choices'][0]['finish_reason']
      if finish_reason != 'stop':
        message = data['choices'][0]['delta']['content']
        full_response += message
        print(message, end="", flush=True)

  print('\n')
  messages.append({"role": "assistant", "content": full_response})

