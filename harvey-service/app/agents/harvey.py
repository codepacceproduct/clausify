import json
from typing import Any

from loguru import logger
from openai import OpenAI

from app.tools.calendar import criar_evento
from app.tools.contracts import analisar_contrato
from app.tools.consultas import consultar_jurisprudencia
from app.tools.clausichat import enviar_mensagem_chat
from app.tools.versionamento import criar_versao
from app.tools.playbook import acessar_playbook
from app.tools.calculos import executar_calculo
from app.tools.configuracoes import atualizar_config
from app.memory import add_memory, get_recent_memory


client = OpenAI(timeout=20, max_retries=2)


SYSTEM_PROMPT = """
Você é Harvey, assistente jurídico executivo da plataforma Clausify.
Você pode executar ações reais no sistema.
Sempre utilize ferramentas quando necessário.
Responda em português de forma objetiva.
"""


async def run_harvey(command: str, user_id: str) -> Any:
  history = get_recent_memory(user_id, limit=8)
  history_block = ""
  if history:
    items = [
      f"[{item['created_at']}] {item['role']}: {item['content']}"
      for item in reversed(history)
    ]
    history_block = "\n\nContexto recente:\n" + "\n".join(items)

  tools = [
    {
      "type": "function",
      "function": {
        "name": "criar_evento",
        "description": "Cria um evento oficial no calendário da Clausify",
        "parameters": {
          "type": "object",
          "properties": {
            "data": {"type": "string"},
            "descricao": {"type": "string"},
          },
          "required": ["data", "descricao"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "analisar_contrato",
        "description": "Analisa um contrato existente no módulo de Contratos",
        "parameters": {
          "type": "object",
          "properties": {
            "contrato_id": {"type": "string"},
          },
          "required": ["contrato_id"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "consultar_jurisprudencia",
        "description": "Consulta jurisprudência no módulo de Consultas",
        "parameters": {
          "type": "object",
          "properties": {
            "consulta": {"type": "string"},
          },
          "required": ["consulta"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "enviar_mensagem_chat",
        "description": "Envia uma mensagem para o módulo ClausiChat",
        "parameters": {
          "type": "object",
          "properties": {
            "mensagem": {"type": "string"},
          },
          "required": ["mensagem"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "criar_versao",
        "description": "Cria uma nova versão em Versionamento",
        "parameters": {
          "type": "object",
          "properties": {
            "documento_id": {"type": "string"},
            "descricao": {"type": "string"},
          },
          "required": ["documento_id", "descricao"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "acessar_playbook",
        "description": "Consulta um tópico no módulo de Playbook",
        "parameters": {
          "type": "object",
          "properties": {
            "topico": {"type": "string"},
          },
          "required": ["topico"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "executar_calculo",
        "description": "Executa um cálculo no módulo de Cálculos",
        "parameters": {
          "type": "object",
          "properties": {
            "tipo": {"type": "string"},
            "parametros": {"type": "object"},
          },
          "required": ["tipo", "parametros"],
        },
      },
    },
    {
      "type": "function",
      "function": {
        "name": "atualizar_config",
        "description": "Atualiza configurações no módulo de Configurações",
        "parameters": {
          "type": "object",
          "properties": {
            "chave": {"type": "string"},
            "valor": {},
          },
          "required": ["chave", "valor"],
        },
      },
    },
  ]

  logger.info("Harvey run_harvey start user_id={} command={}", user_id, command)

  response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
      {"role": "system", "content": SYSTEM_PROMPT},
      {"role": "system", "content": history_block} if history_block else None,
      {"role": "user", "content": command},
    ],
    tools=tools,
  )

  message = response.choices[0].message
  tool_calls = getattr(message, "tool_calls", None)

  if tool_calls:
    call = tool_calls[0]
    arguments = call.function.arguments
    args = json.loads(arguments)

    if call.function.name == "criar_evento":
      result = criar_evento(args["data"], args["descricao"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "criar_evento")
      logger.info("Harvey tool criar_evento user_id={} result={}", user_id, result)
      return {"tool": "criar_evento", "data": result}
    if call.function.name == "analisar_contrato":
      result = analisar_contrato(args["contrato_id"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "analisar_contrato")
      logger.info("Harvey tool analisar_contrato user_id={} result={}", user_id, result)
      return {"tool": "analisar_contrato", "data": result}
    if call.function.name == "consultar_jurisprudencia":
      result = consultar_jurisprudencia(args["consulta"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "consultar_jurisprudencia")
      logger.info("Harvey tool consultar_jurisprudencia user_id={} result={}", user_id, result)
      return {"tool": "consultar_jurisprudencia", "data": result}
    if call.function.name == "enviar_mensagem_chat":
      result = enviar_mensagem_chat(args["mensagem"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "enviar_mensagem_chat")
      logger.info("Harvey tool enviar_mensagem_chat user_id={} result={}", user_id, result)
      return {"tool": "enviar_mensagem_chat", "data": result}
    if call.function.name == "criar_versao":
      result = criar_versao(args["documento_id"], args["descricao"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "criar_versao")
      logger.info("Harvey tool criar_versao user_id={} result={}", user_id, result)
      return {"tool": "criar_versao", "data": result}
    if call.function.name == "acessar_playbook":
      result = acessar_playbook(args["topico"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "acessar_playbook")
      logger.info("Harvey tool acessar_playbook user_id={} result={}", user_id, result)
      return {"tool": "acessar_playbook", "data": result}
    if call.function.name == "executar_calculo":
      result = executar_calculo(args["tipo"], args.get("parametros", {}), user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "executar_calculo")
      logger.info("Harvey tool executar_calculo user_id={} result={}", user_id, result)
      return {"tool": "executar_calculo", "data": result}
    if call.function.name == "atualizar_config":
      result = atualizar_config(args["chave"], args["valor"], user_id=user_id)
      add_memory(user_id, "user", command)
      add_memory(user_id, "assistant", json.dumps(result), "atualizar_config")
      logger.info("Harvey tool atualizar_config user_id={} result={}", user_id, result)
      return {"tool": "atualizar_config", "data": result}

  add_memory(user_id, "user", command)
  if message.content:
    add_memory(user_id, "assistant", message.content)

  logger.info("Harvey run_harvey end user_id={} content={}", user_id, message.content)

  return message.content
