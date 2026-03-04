# ContextMatic API Documentation 📡

## Usage
ContextMatic primarily uses Supabase for data persistence and authentication. However, specific AI and payment services are handled via custom logic or edge functions.

## Endpoints

### 1. Video Generation

**POST /api/generate-video** (Simulated / Edge Function)

-   **Description**: Triggers the AI video generation process.
-   **Auth**: Required (Bearer Token).
-   **Payload**:
    ```json
    {
      "prompt": "A cinematic shot of a futuristic city...",
      "platform": "tiktok", // 'tiktok' | 'reels' | 'shorts'
      "style": "cinematic" // 'cinematic' | 'anime' | 'realistic'
    }
    ```
-   **Response**:
    ```json
    {
      "jobId": "vid_123456789",
      "status": "processing",
      "estimatedTime": 15
    }
    ```

### 2. Video Status

**GET /api/video-status/:jobId** (Simulated / Edge Function)

-   **Description**: Checks the status of a video generation job.
-   **Auth**: Required.
-   **Response**:
    ```json
    {
      "id": "vid_123456789",
      "status": "completed",
      "url": "https://storage.googleapis.com/contextmatic-videos/vid_123456789.mp4",
      "thumbnail": "https://storage.googleapis.com/contextmatic-videos/vid_123456789_thumb.jpg"
    }
    ```

### 3. Payments (Razorpay)

**POST /api/create-subscription** (Client-Side / Serverless)

-   **Description**: Creates a subscription order.
-   **Auth**: Required.
-   **Payload**:
    ```json
    {
      "planId": "plan_pro_monthly"
    }
    ```
-   **Response**:
    ```json
    {
      "orderId": "order_987654321",
      "currency": "USD",
      "amount": 1500
    }
    ```

## Authentication

ContextMatic uses Supabase Auth. All requests to protected endpoints must include the `Authorization` header:

`Authorization: Bearer <access_token>`

## Rate Limiting

-   **Free Tier**: 10 generations / month.
-   **Pro Tier**: 50 generations / month.
-   **Team Tier**: 200 generations / month.
