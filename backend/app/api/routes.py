import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Conversation, Message
from app.schemas.schemas import (
    ChatRequest,
    ConversationCreate,
    ConversationDetailOut,
    ConversationOut,
    ConversationUpdate,
)
from app.services.ollama_service import ollama_service

router = APIRouter()


@router.get("/models")
async def get_models():
    try:
        models = await ollama_service.list_models()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not reach Ollama: {exc}")
    return {"models": models}


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(db: Session = Depends(get_db)):
    return db.query(Conversation).order_by(Conversation.updated_at.desc()).all()


@router.post("/conversations", response_model=ConversationOut)
def create_conversation(payload: ConversationCreate, db: Session = Depends(get_db)):
    convo = Conversation(title=payload.title or "New Chat", model=payload.model)
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailOut)
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    convo = db.get(Conversation, conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return convo


@router.patch("/conversations/{conversation_id}", response_model=ConversationOut)
def update_conversation(
    conversation_id: str, payload: ConversationUpdate, db: Session = Depends(get_db)
):
    convo = db.get(Conversation, conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if payload.title is not None:
        convo.title = payload.title
    if payload.model is not None:
        convo.model = payload.model
    db.commit()
    db.refresh(convo)
    return convo


@router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str, db: Session = Depends(get_db)):
    convo = db.get(Conversation, conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(convo)
    db.commit()
    return {"ok": True}


@router.post("/chat/stream")
async def chat_stream(payload: ChatRequest, db: Session = Depends(get_db)):
    convo = db.get(Conversation, payload.conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    user_msg = Message(conversation_id=convo.id, role="user", content=payload.content)
    db.add(user_msg)
    db.commit()

    history = [{"role": m.role, "content": m.content} for m in convo.messages]

    async def event_generator():
        full_reply = ""
        try:
            async for token in ollama_service.stream_chat(convo.model, history):
                full_reply += token
                yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
            return

        assistant_msg = Message(
            conversation_id=convo.id, role="assistant", content=full_reply
        )
        db.add(assistant_msg)
        if convo.title == "New Chat":
            convo.title = payload.content[:50]
        db.commit()
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
