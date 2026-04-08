"""
Мозг Guest AI — обрабатывает сообщения чата и генерирует изображения через OpenRouter.
Поддерживает: обычный чат (GPT-4o) и рисование картинок (DALL-E 3 via OpenRouter).
"""
import json
import os
import urllib.request
import urllib.error


OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
CHAT_MODEL = "openai/gpt-4o"
IMAGE_MODEL = "openai/dall-e-3"

SYSTEM_PROMPT = """Ты — Guest, умный и дружелюбный AI-ассистент. Ты помогаешь пользователям создавать тексты, идеи, контент для бизнеса и отвечаешь на любые вопросы.

Твои возможности:
- Генерация и редактирование текстов любого формата
- Помощь с маркетингом, SMM, SEO
- Ответы на вопросы по бизнесу
- Написание кода, скриптов, инструкций
- Рисование картинок — когда пользователь просит нарисовать или создать изображение, ответь ТОЛЬКО JSON: {"action":"draw","prompt":"детальное описание на английском"}

Отвечай на русском языке. Будь полезным, конкретным и дружелюбным. Не добавляй лишних предисловий."""

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def call_openrouter(payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://poehali.dev",
            "X-Title": "Guest AI",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def generate_image(prompt: str) -> str:
    """Генерирует изображение через OpenRouter DALL-E 3, возвращает URL."""
    data = json.dumps({
        "model": IMAGE_MODEL,
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "hd",
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/images/generations",
        data=data,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://poehali.dev",
            "X-Title": "Guest AI",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))
    return result["data"][0]["url"]


def handler(event: dict, context) -> dict:
    """Основной обработчик чата Guest AI."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        messages = body.get("messages", [])
        user_message = body.get("message", "")

        if not user_message:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Сообщение не может быть пустым"}),
            }

        # Формируем историю сообщений
        history = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in messages[-10:]:  # последние 10 сообщений для контекста
            if msg.get("role") in ("user", "assistant") and msg.get("content"):
                history.append({"role": msg["role"], "content": msg["content"]})
        history.append({"role": "user", "content": user_message})

        # Получаем ответ от модели
        chat_result = call_openrouter({
            "model": CHAT_MODEL,
            "messages": history,
            "max_tokens": 1500,
            "temperature": 0.7,
        })

        ai_text = chat_result["choices"][0]["message"]["content"].strip()

        # Проверяем, хочет ли AI нарисовать картинку
        try:
            action_data = json.loads(ai_text)
            if isinstance(action_data, dict) and action_data.get("action") == "draw":
                image_prompt = action_data.get("prompt", user_message)
                image_url = generate_image(image_prompt)
                return {
                    "statusCode": 200,
                    "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                    "body": json.dumps({
                        "type": "image",
                        "image_url": image_url,
                        "prompt": image_prompt,
                        "text": f"Готово! Вот твоя картинка по запросу: «{image_prompt}»",
                    }),
                }
        except (json.JSONDecodeError, TypeError):
            pass

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({
                "type": "text",
                "text": ai_text,
            }),
        }

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {
            "statusCode": 502,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": f"Ошибка AI: {e.code}", "detail": error_body}),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}),
        }
