from fastapi import  HTTPException, Request, APIRouter
from fastapi.responses import StreamingResponse
from botocore.exceptions import NoCredentialsError, ClientError
import re
from typing import Optional

from app.service.upload import S3UploadService
from app.service.upload import S3UploadService

upload_service = S3UploadService()

router = APIRouter()

def stream_s3_file(bucket: str, key: str, start: int = 0, end: Optional[int] = None):
    try:
        if end is not None:
            range_header = f'bytes={start}-{end}'
            response = upload_service.s3.get_object(Bucket=bucket, Key=key, Range=range_header)
        else:
            response = upload_service.s3.get_object(Bucket=bucket, Key=key)
        chunk_size = 8192
        body = response['Body']
        try:
            while True:
                chunk = body.read(chunk_size)
                if not chunk:
                    break
                yield chunk
        finally:
            body.close()
    except ClientError as e:
        raise HTTPException(status_code=404, detail=f"Error accessing file: {str(e)}")
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")

@router.get("/stream-video")
async def stream_video(request: Request, s3_url: str):
    try:
        bucket, key = upload_service.parse_s3_url(s3_url)
        file_size = upload_service.get_file_size(bucket, key)
        range_header = request.headers.get('range')

        if range_header:
            range_match = re.search(r'bytes=(\d*)-(\d*)', range_header)
            if range_match:
                start = int(range_match.group(1)) if range_match.group(1) else 0
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
                if end >= file_size:
                    end = file_size - 1
                content_length = end - start + 1
                headers = {
                    'Content-Range': f'bytes {start}-{end}/{file_size}',
                    'Accept-Ranges': 'bytes',
                    'Content-Length': str(content_length),
                    'Content-Type': 'video/mp4',
                }

                return StreamingResponse(
                    stream_s3_file(bucket, key, start, end),
                    status_code=206,
                    headers=headers,
                    media_type='video/mp4'
                )

        headers = {
            'Accept-Ranges': 'bytes',
            'Content-Length': str(file_size),
            'Content-Type': 'video/mp4',
        }

        return StreamingResponse(
            stream_s3_file(bucket, key),
            headers=headers,
            media_type='video/mp4'
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
