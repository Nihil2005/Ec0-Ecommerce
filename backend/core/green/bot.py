from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import re

patterns = [
    [
        r"my name is (.*)",
        ["Hello %1, how can I help you today?"]
    ],
    [
        r"what is your name?",
        ["My name is ChatBot and I'm here to assist you."]
    ],
    [
        r"(?i)(hi|hello)",
        ["Hi there!", "Hello!", "Hey! How can I assist you today?"]
    ],
    [
        r"sorry (.*)",
        ["No problem, please don't hesitate to ask me anything."]
    ],
    [
        r"(.*)",
        ["I'm sorry, I didn't understand that. Can you please rephrase?"]
    ]
]

@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST' or request.method == 'GET':
        user_input = request.GET.get('message') if request.method == 'GET' else request.POST.get('message')
        
        if user_input is None or user_input.strip() == '':
            return JsonResponse({'message': "Please provide a valid input."})
        
        response = None
        for pattern, responses in patterns:
            match = re.match(pattern, user_input)
            if match:
                response = responses[0]  # Selecting the first response
                break
        
        if response is None or len(response) == 0:
            return JsonResponse({'message': "I'm sorry, I didn't understand that. Can you please rephrase?"})
        
        return JsonResponse({'message': response})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
