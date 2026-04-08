"""
Мозг Guest AI — обрабатывает сообщения чата и генерирует изображения.
Чат: OpenRouter (GPT-4o). Картинки: Pollinations.ai (бесплатно, без ключа).
"""
import json
import os
import urllib.request
import urllib.error
import urllib.parse


OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "").strip()
CHAT_MODEL = "openai/gpt-4o"

SYSTEM_PROMPT = """Ты — Guest, умный и дружелюбный AI-ассистент на русском языке. Ты помогаешь пользователям создавать тексты, идеи, контент для бизнеса и отвечаешь на любые вопросы.

Твои возможности:
- Генерация и редактирование текстов любого формата
- Помощь с маркетингом, SMM, SEO
- Ответы на вопросы по бизнесу
- Написание кода, скриптов, инструкций
- Рисование картинок

ВАЖНО: Когда пользователь просит нарисовать, создать изображение/картинку/арт/логотип/иллюстрацию — ответь СТРОГО в этом формате без лишнего текста:
{"action":"draw","prompt":"detailed English description of the image","prompt_ru":"описание на русском"}

Отвечай на русском языке. Будь конкретным и дружелюбным."""

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
            "Authorization": f"Bearer {OPENROUTER_API_KEY.strip()}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://poehali.dev",
            "X-Title": "Guest AI",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def generate_image_url(prompt: str) -> str:
    """Генерирует URL картинки через Pollinations.ai (бесплатно, без ключа)."""
    encoded = urllib.parse.quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1024&enhance=true&nologo=true&model=flux"


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
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Сообщение не может быть пустым"}),
            }

        if not OPENROUTER_API_KEY:
            return {
                "statusCode": 200,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"type": "error", "text": "API ключ не настроен. Добавьте OPENROUTER_API_KEY в секреты проекта."}),
            }

        # Формируем историю сообщений
        history = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in messages[-10:]:
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
        # Ищем JSON в тексте (модель иногда добавляет текст вокруг)
        action_data = None
        try:
            action_data = json.loads(ai_text)
        except (json.JSONDecodeError, TypeError):
            # Пробуем найти JSON внутри текста
            import re
            match = re.search(r'\{.*?"action"\s*:\s*"draw".*?\}', ai_text, re.DOTALL)
            if match:
                try:
                    action_data = json.loads(match.group())
                except Exception:
                    pass

        if isinstance(action_data, dict) and action_data.get("action") == "draw":
            image_prompt = action_data.get("prompt", user_message)
            prompt_ru = action_data.get("prompt_ru", user_message)
            image_url = generate_image_url(image_prompt)
            return {
                "statusCode": 200,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({
                    "type": "image",
                    "image_url": image_url,
                    "prompt": prompt_ru,
                    "text": f"Рисую по запросу: «{prompt_ru}»",
                }),
            }

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({
                "type": "text",
                "text": ai_text,
            }),
        }

    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = e.read().decode("utf-8")
            error_json = json.loads(error_body)
            error_msg = error_json.get("error", {}).get("message", error_body)
        except Exception:
            error_msg = error_body or str(e)

        user_msg = "Ошибка соединения с AI"
        if e.code == 401:
            user_msg = "Неверный API ключ OpenRouter. Проверьте секрет OPENROUTER_API_KEY."
        elif e.code == 402:
            user_msg = "Недостаточно средств на балансе OpenRouter. Пополните баланс на openrouter.ai."
        elif e.code == 429:
            user_msg = "Слишком много запросов. Попробуйте через несколько секунд."

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"type": "error", "text": user_msg, "detail": error_msg}),
        }

    except Exception as e:
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"type": "error", "text": f"Что-то пошло не так: {str(e)}"}),
        }