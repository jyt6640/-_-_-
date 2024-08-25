from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionXLPipeline
from safetensors.torch import load_file
from PIL import Image
from io import BytesIO
import base64
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 필요한 특정 도메인
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipe = None

model_path = r"C:\Users\user\Downloads\flat childrenXX.safetensors"

# 기본 네거티브 프롬프트 설정
negative_prompt_default = (
    "low quality, blurry, pixelated, low resolution, bad anatomy, deformed, poorly drawn, out of focus, extra limbs, disfigured, low detail, ugly, distorted face, text, watermark, signature, draft, amateur, wrong proportions, overexposed, underexposed, grayscale, monochrome, realism, 3D render, photorealistic, abstract, glitch, noise, dark, dull colors, low contrast, flat shading, incorrect lighting, unwanted reflections, harsh shadows, bad perspective, photorealistic, CGI, hyper-realistic, overly detailed textures, harsh lighting, excessive shadows"
)

@app.on_event("startup")
async def load_model():
    global pipe
    try:
        # Stable Diffusion XL 파이프라인 로드
        pipe = StableDiffusionXLPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0")

        # safetensors 파일에서 모델 가중치 로드
        state_dict = load_file(model_path)
        pipe.unet.load_state_dict(state_dict, strict=False)

        # 모델을 GPU로 이동
        device = "cuda" if torch.cuda.is_available() else "cpu"
        pipe.to(device)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")

# 입력 데이터 모델 정의
class ImagePrompt(BaseModel):
    prompt: str
    negative_prompt: str = None  # 네거티브 프롬프트 옵션 추가

# JSON 데이터를 받아 이미지 생성 엔드포인트 정의
@app.post("/generate_image/")
async def generate_image(prompt_data: ImagePrompt):
    global pipe
    try:
        if pipe is None:
            raise HTTPException(status_code=503, detail="Model not loaded yet. Please try again later.")
        
        # 사용자가 네거티브 프롬프트를 제공하지 않으면 기본값 사용
        negative_prompt = prompt_data.negative_prompt if prompt_data.negative_prompt else negative_prompt_default
        
        # 텍스트 프롬프트와 네거티브 프롬프트를 사용하여 이미지 생성
        image = pipe(prompt_data.prompt, height=512, width=512, negative_prompt=negative_prompt).images[0]

        # 이미지 로컬에 저장
        save_path = "generated_image.png"  # 저장 경로를 원하는 대로 변경 가능
        image.save(save_path)

        # 이미지 데이터를 base64로 인코딩하여 반환
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"image_data": img_str, "file_path": save_path}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
