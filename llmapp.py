from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
import asyncio
from fastapi import Query
import dotenv

# FastAPI 인스턴스 생성
app = FastAPI()
dotenv.load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

origins = ["*"]  # 모든 origin 허용

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 모든 출처(origin) 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 요청 바디를 위한 동화 생성용 Pydantic 모델 정의
class StoryRequest(BaseModel):
    protagonist_name: str
    protagonist_characteristics: str
    gender: str
    age: int
    era: str
    genre: str
    start_place: str
    choices_per_page: int
    story_mood: str
    theme: str
    current_page: int  # 현재 페이지 번호
    ending_page_count: int
    ending_style: str
    
# StoryRequest 모델에 새로운 필드 추가 (선택된 옵션)
class StoryRequestWithChoice(BaseModel):
    previous_text: str  # 이전 페이지의 내용
    previous_choice_text: str  # 사용자가 선택한 옵션의 텍스트
    current_page: int  # 현재 페이지 번호
    ending_page_count: int  # 종료 페이지 수
    protagonist_name: str  # 주인공 이름
    protagonist_characteristics: str  # 주인공 성격
    gender: str  # 주인공 성별
    age: int  # 주인공 나이
    era: str  # 이야기의 시대
    genre: str  # 이야기의 장르
    start_place: str  # 이야기의 시작 장소
    choices_per_page: int  # 페이지당 선택지 수
    story_mood: str  # 이야기 분위기
    theme: str  # 이야기의 주제
    ending_style: str  # 이야기의 종료 스타일


async def generate_story_text(request: StoryRequest):
    story_prompt = (
        f"당신은 전문 어린이 동화 작가입니다. 사용자가 주인공, 성격, 성별, 시대, 장르, 시작 장소, 종료 페이지 수 등과 같은 세부 정보를 제공할 것입니다. 이러한 세부 정보를 바탕으로 창의적이고 동화책을 작성하십시오. 50단어 내로 내용을 생성해야합니다. 설정된 종료 페이지 수에 맞게 자연스럽게 마무리됩니다. 그리고 동화 내용을 마무리할때 뭔가 주인공이 선택지가 2개정도 생길 수 있도록 동화를 끝맺음 해주세요.\n\n"
        f"스토리 작성 참고 사항:\n"
        f"테마: 이야기의 중심 테마는 무엇인가요? : {request.theme}\n"
        f"캐릭터: 주인공의 이름, 성격, 외모는 무엇인가요? : {request.protagonist_name}, {request.protagonist_characteristics}\n"
        f"설정: 이야기의 시대와 장소는 무엇인가요? : {request.era}, {request.start_place}\n"
        f"톤: 이야기의 톤과 분위기를 어떻게 조정하고 싶으신가요? : {request.story_mood}\n"
        f"길이 및 형식: 텍스트의 단어 수는 얼마인가요? : 50단어. 대상 연령대는 무엇인가요? : 영유아\n\n"
        f"현재 페이지는 {request.current_page}입니다."
    )
    
    try:
        story_response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 창의적인 동화 작가입니다."},
                {"role": "user", "content": story_prompt}
            ]
        )
        story_text_en = story_response['choices'][0]['message']['content'].strip()
        if not story_text_en:
            raise HTTPException(status_code=500, detail="Error: Empty story text generated.")
        return story_text_en
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story text: {str(e)}")

async def generate_choices(request: StoryRequest, story_text_en: str):
    choices_prompt = (
        f"다음 동화 내용을 바탕으로: '{story_text_en}', 주인공이 스토리를 진행하기 위해 선택할 수 있는 2개의 선택지를 생성해 주세요. "
        f"각 선택지는 간결한 문장으로 작성되어야 하며, 특수 문자나 마크다운 형식은 없어야 합니다."
    )
    try:
        choices_response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 창의적인 동화 작가입니다."},
                {"role": "user", "content": choices_prompt}
            ]
        )
        
        # 선택지 목록 생성
        choices_list_en = [choice.strip() for choice in choices_response['choices'][0]['message']['content'].strip().split('\n') if choice.strip()]
        
        # 선택지 수가 부족할 경우 기본 선택지 추가
        if len(choices_list_en) < 2:
            choices_list_en.extend([f"기본 선택지 {i+1}" for i in range(2 - len(choices_list_en))])
        
        # 무조건 2개의 선택지를 반환
        return {str(i + 1): choice for i, choice in enumerate(choices_list_en[:2])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"선택지 생성 중 오류 발생: {str(e)}")

async def generate_stable_prompt(request: StoryRequest, story_text_en: str):
    stable_prompt_prompt = (
        f"다음 스토리 및 주인공을 바탕으로 간단한 Stable Diffusion 프롬프트를 생성해 주세요: "
        f"동화내용 : {story_text_en}, 주인공 이름 및 성격: {request.protagonist_name}, {request.protagonist_characteristics}. 프롬프트는 간결하게 작성해야합니다."
        f"프롬프트에는 특수 문자나 마크다운 형식이 없어야 하며, 65토큰 이내로 작성해 주세요."
        f"문장이 아닌 주어와 동사를 뺀 문구로 만들어주며 짧막한 단어로 구성해야합니다.."
        f"항상 영어로 결과값을 나오게 해주세요."
    )
    try:
        stable_response = await openai.ChatCompletion.acreate(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 창의적인 동화 작가입니다."},
                {"role": "user", "content": stable_prompt_prompt}
            ]
        )
        
        stable_prompt = stable_response['choices'][0]['message']['content'].strip().replace('\n', ' ')
        stable_prompt = stable_prompt.replace("'", "").replace('"', "")
        
        # 토큰 수가 65를 초과할 경우 자르기
        if len(stable_prompt.split()) > 65:
            stable_prompt = ' '.join(stable_prompt.split()[:65])
        
        return stable_prompt
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stable Diffusion 프롬프트 생성 중 오류 발생: {str(e)}")

@app.post("/generate_story_page/")
async def generate_story_page_endpoint(request: StoryRequest):
    try:
        
        # 1. 동화 텍스트 생성
        story_text_en = await generate_story_text(request)
        
        # 2. 선택지 생성
        choices_en = await generate_choices(request, story_text_en)
        
        # 3. Stable Diffusion 프롬프트 생성
        stable_prompt = await generate_stable_prompt(request, story_text_en)

        # 5. 결과 반환
        return {
            "text": story_text_en,
            "choices": choices_en,
            "stable": "children's picture books,crayon paintings,blush" + stable_prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_next_page/")
async def generate_next_page_endpoint(request: StoryRequestWithChoice):
    try:
        await asyncio.sleep(20)
        if request.current_page == request.ending_page_count:
            # 종료 페이지에 도달했을 때의 프롬프트
            next_story_prompt = (
                f"이전 동화 내용: {request.previous_text}\n"
                f"사용자가 '{request.previous_choice_text}'을(를) 선택했습니다. "
                f"이 선택을 바탕으로 이야기를 자연스럽게 마무리 지으세요. "
                f"현재 페이지는 {request.current_page}입니다."
                f"다음 이야기 역시 50단어 내외로 작성되어야 하며, 이야기가 중간에 멈추지 않고 자연스럽게 종료되어야 합니다."
            )
            
            # 다음 페이지의 스토리 생성 (마무리)
            story_response = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "당신은 창의적인 동화 작가입니다."},
                    {"role": "user", "content": next_story_prompt}
                ]
            )
            story_text_en = story_response['choices'][0]['message']['content'].strip()

            # Stable Diffusion 프롬프트 생성
            stable_prompt = await generate_stable_prompt(request, story_text_en)

            # 결과 반환 (선택지 없음)
            return {
                "text": story_text_en,
                "choices": [],  # 선택지 없음
                "stable": "children's picture books,crayon paintings,blush" + stable_prompt
            }
        else:
            # 1. 이전 스토리와 선택된 옵션을 기반으로 새로운 스토리 프롬프트 작성
            next_story_prompt = (
                f"이전 동화 내용: {request.previous_text}\n"
                f"사용자가 '{request.previous_choice_text}'을(를) 선택했습니다. "
                f"이 선택을 바탕으로 자연스럽게 이어지는 다음 페이지의 이야기를 작성하세요. "
                f"현재 페이지는 {request.current_page}입니다."
                f"{request.ending_page_count}페이지에 종료가 되어야 합니다. "
                f"다음 이야기 역시 50단어 내외로 작성되어야 하며, 이야기가 중간에 멈추지 않고 자연스럽게 이어져야 합니다."
            )

            # 2. 다음 페이지의 스토리 생성
            story_response = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "당신은 창의적인 동화 작가입니다."},
                    {"role": "user", "content": next_story_prompt}
                ]
            )
            story_text_en = story_response['choices'][0]['message']['content'].strip()

            # 3. 새로운 선택지 생성
            choices_en = await generate_choices(request, story_text_en)

            # 4. 새로운 Stable Diffusion 프롬프트 생성
            stable_prompt = await generate_stable_prompt(request, story_text_en)

            # 5. 결과 반환
            return {
                "text": story_text_en,
                "choices": choices_en,
                "stable": "children's picture books,crayon paintings,blush" + stable_prompt
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 기본 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "Welcome to the GPT-based Story Generation Service!"}
