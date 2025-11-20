# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Run Backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies if needed (e.g. for some python packages)
# RUN apt-get update && apt-get install -y gcc

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend code
COPY backend/ .

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./static

# Expose port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
