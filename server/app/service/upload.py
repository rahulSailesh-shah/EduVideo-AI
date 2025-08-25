import uuid
import boto3
from urllib.parse import urlparse
import re
import time
from botocore.exceptions import  ClientError
from fastapi import HTTPException
from app.core.config import settings
import os


class S3UploadService:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
        )
        self.bucket = settings.s3_bucket_name

    def upload_video(self, video_data, username: str, chat_id: int) -> str:
        import io
        video_filename = f"video_{uuid.uuid4().hex[:8]}.mp4"
        s3_key = f"{username}/{chat_id}/{video_filename}"
        try:
            if isinstance(video_data, bytes):
                fileobj = io.BytesIO(video_data)
            else:
                fileobj = video_data
            self.s3.upload_fileobj(fileobj, self.bucket, s3_key, ExtraArgs={
                        "ContentType": "video/mp4",
                        "CacheControl": "no-cache, no-store, must-revalidate",
                        "Expires": "0"
                    })
            timestamp = int(time.time())
            s3_url = f"https://{self.bucket}.s3.amazonaws.com/{s3_key}?v={timestamp}"
            return s3_url
        except Exception as e:
            raise RuntimeError(f"Failed to upload video to S3: {e}")

    def parse_s3_url(self, s3_url: str) -> tuple[str, str]:
        # Remove query parameters (like cache-busting timestamps) before parsing
        clean_url = s3_url.split('?')[0]

        if clean_url.startswith('s3://'):
            parsed = urlparse(clean_url)
            bucket = parsed.netloc
            key = parsed.path.lstrip('/')
        elif 's3.amazonaws.com' in clean_url:
            if clean_url.startswith('https://s3.amazonaws.com/'):
                path = clean_url.replace('https://s3.amazonaws.com/', '')
                bucket, key = path.split('/', 1)
            else:
                match = re.match(r'https://(.+?)\.s3\.amazonaws\.com/(.+)', clean_url)
                if match:
                    bucket, key = match.groups()
                else:
                    raise ValueError("Invalid S3 URL format")
        else:
            raise ValueError("Invalid S3 URL format")

        return bucket, key

    def get_file_size(self, bucket: str, key: str) -> int:
        try:
            response = self.s3.head_object(Bucket=bucket, Key=key)
            return response['ContentLength']
        except ClientError as e:
            raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")

    def update_video_from_path(self, s3_url: str, video_path: str) -> str:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found at path: {video_path}")
        try:
            bucket, key = self.parse_s3_url(s3_url)
        except ValueError as e:
            raise ValueError(f"Invalid S3 URL: {e}")
        try:
            with open(video_path, 'rb') as video_file:
                self.s3.upload_fileobj(
                    video_file,
                    bucket,
                    key,
                    ExtraArgs={
                        "ContentType": "video/mp4",
                        "CacheControl": "no-cache, no-store, must-revalidate",
                        "Expires": "0"
                    }
                )
            timestamp = int(time.time())
            return f"{s3_url}?v={timestamp}"
        except FileNotFoundError:
            raise FileNotFoundError(f"Video file not found at path: {video_path}")
        except Exception as e:
            raise RuntimeError(f"Failed to update video in S3: {e}")
