import os
import numpy as np
import pandas as pd
import wandb
from datasets import Dataset
from transformers import CLIPTokenizer, TrainingArguments, Trainer, EarlyStoppingCallback, IntervalStrategy
from diffusers import StableDiffusionPipeline, EulerAncestralDiscreteScheduler
from peft import LoraConfig, get_peft_model
import torch
from PIL import Image
import safetensors.torch

# W&B 설정
wandb.login()  # W&B에 로그인합니다. 토큰이 필요할 수 있습니다.

# 데이터 경로 설정
train_data_path = '/home/ai/Google_Cloud_Ai_Project/newModel/datasets/Traning/'
train_data_frame = pd.read_csv(os.path.join(train_data_path, "training_dataset.csv"))
train_data_frame["image_path"] = train_data_frame["image_path"].apply(lambda x: os.path.join(train_data_path, x))

val_data_path = '/home/ai/Google_Cloud_Ai_Project/newModel/datasets/Validation'
val_data_frame = pd.read_csv(os.path.join(val_data_path, "validation_dataset.csv"))
val_data_frame["image_path"] = val_data_frame["image_path"].apply(lambda x: os.path.join(val_data_path, x))

# 데이터셋 로드
train_dataset = Dataset.from_pandas(train_data_frame)
val_dataset = Dataset.from_pandas(val_data_frame)

# 모델 및 스케줄러 로드
repo = "Bingsu/my-korean-stable-diffusion-v1-5"
euler_ancestral_scheduler = EulerAncestralDiscreteScheduler.from_pretrained(repo, subfolder="scheduler")
pipe = StableDiffusionPipeline.from_pretrained(
    repo, scheduler=euler_ancestral_scheduler, torch_dtype=torch.float16,
)
pipe.to("cuda")

# CLIP 토크나이저 로드
clip_tokenizer_id = "openai/clip-vit-base-patch32"
pipe.tokenizer = CLIPTokenizer.from_pretrained(clip_tokenizer_id)

# LORA 설정
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.1,
    bias="none",
    target_modules=["q_proj", "v_proj"]  # LORA를 적용할 모듈 지정
)

# 모델에 LORA 적용
model = get_peft_model(pipe.text_encoder, lora_config)

# 데이터 전처리 함수
def preprocess_function(examples):
    images = []
    valid_captions = []
    
    for image_path, caption in zip(examples["image_path"], examples["caption"]):
        try:
            if not os.path.exists(image_path):
                print(f"Image not found: {image_path}")  # 디버깅 메시지
                continue
            
            # Check if file size is greater than 0
            if os.path.getsize(image_path) == 0:
                print(f"Image file is empty: {image_path}")
                continue
            
            # Try opening the image
            image = Image.open(image_path).convert("RGB")
            images.append(np.array(image))
            valid_captions.append(caption)
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")
    
    if len(valid_captions) == 0 or len(images) == 0:
        return {"pixel_values": [], "input_ids": [], "attention_mask": []}
    
    tokens = pipe.tokenizer(valid_captions, padding="max_length", truncation=True, max_length=77, return_tensors="pt")
    return {
        "pixel_values": [torch.tensor(img).permute(2, 0, 1) for img in images],  # 이미지를 tensor로 변환
        "input_ids": tokens.input_ids.tolist(),  # Tensor에서 리스트로 변환
        "attention_mask": tokens.attention_mask.tolist()
    }

# 데이터셋 전처리
train_dataset = train_dataset.map(preprocess_function, batched=True, remove_columns=["image_path", "caption"])
val_dataset = val_dataset.map(preprocess_function, batched=True, remove_columns=["image_path", "caption"])

# 데이터셋 크기 확인
print(f"Train dataset size: {len(train_dataset)}")
print(f"Validation dataset size: {len(val_dataset)}")

# 학습 설정
training_args = TrainingArguments(
    output_dir="./results",
    per_device_train_batch_size=4,
    num_train_epochs=10,
    evaluation_strategy=IntervalStrategy.EPOCH,
    save_strategy=IntervalStrategy.EPOCH,
    save_total_limit=2,
    remove_unused_columns=False,
    push_to_hub=False,
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    logging_dir='./logs',
    logging_steps=500,
    report_to="wandb"  # W&B로 로깅
)

# W&B 프로젝트 설정
wandb.init(project="dreaming-image")  # 프로젝트 이름 설정

# Trainer 설정
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=pipe.tokenizer,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=3)],
)

# 파인 튜닝 실행
trainer.train()

# 체크포인트 저장
best_model_dir = "./results/best_model"
model.save_pretrained(best_model_dir)
pipe.tokenizer.save_pretrained(best_model_dir)

# 모델을 .safetensors 형식으로 저장
torch.save(model.state_dict(), os.path.join(best_model_dir, "best_model.ckpt"))
safetensors.torch.save_file(model.state_dict(), os.path.join(best_model_dir, "best_model.safetensors"))

wandb.finish()  # W&B 세션 종료
