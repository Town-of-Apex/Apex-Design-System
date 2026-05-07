FROM python:3.13-slim

WORKDIR /app

# Install basic system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Strip Windows CRLF and make entrypoint executable
RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh

# Standard Apex Port
EXPOSE 8080

ENV BASE_PATH=/demo
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
