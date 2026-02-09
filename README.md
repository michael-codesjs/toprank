# Agentic Brand Presence Pipeline

This project is a sophisticated AI-powered pipeline designed to analyze a brand's presence on Amazon. It utilizes a modern agentic architecture to transform a domain input into actionable strategic insights without manual intervention.

## 🚀 Architecture

The solution uses a decoupled client-server architecture:

- **Frontend**: Next.js 14 (App Router) with Tailwind CSS v4 and Framer Motion for a premium, high-contrast dashboard.
- **Backend**: Node.js/Express with **Mastra** agent framework.
- **AI/LLM**: **Claude 3.5 Sonnet** (via Anthropic API) for reasoning, data extraction, and strategic analysis.
- **Search Logic**: **Serper.dev** (Google Shopping/Search API) for robust real-time data retrieval.

### Pipeline Flow

1.  **Input**: User enters domain (e.g., `patagonia.com`).
2.  **Extraction**: `extractorAgent` parses the domain, searches Amazon via Serper, and uses Claude 3.5 Sonnet to map raw search results into a strict JSON schema (`ExtractionSchema`).
3.  **Analysis**: The agent (or independent `analystAgent`) derives 3 key strategic insights (Opportunity, Growth, Warning) from the structured data.
4.  **Presentation**: Data is streamed in real-time to the frontend and visualized in an interactive dashboard.

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- API Keys:
  - `ANTHROPIC_API_KEY`: For Claude 3.5 Sonnet.
  - `SERPER_API_KEY`: For Google Shopping search results.

### 1. Backend Setup

```bash
cd backend
# Create .env file
cp .env.example .env
# Add your keys:
# PORT=8000
# ANTHROPIC_API_KEY=sk-...
# SERPER_API_KEY=...

npm install
npm run dev
```

_The backend runs on http://localhost:8000._

### 2. Frontend Setup

```bash
cd app
# Create .env file
cp .env.example .env
# Ensure NEXT_PUBLIC_API_URL=http://localhost:8000

npm install
npm run dev
```

_The frontend runs on http://localhost:3000._

---

## 🎮 Usage

### Full Automated Pipeline

1.  Open `http://localhost:3000`.
2.  Enter a brand domain (e.g., `vuori.com`) in the input field.
3.  Click "Run Audit".
4.  Watch the "Pipeline Visualizer" trace the agent's actions (Extraction -> Analysis).
5.  View the final "Agent Intelligence Center" dashboard with the generated insights and inventory table.

### Runnable Independently (Testing)

**Step 1: Data Extraction Only**

Option A: Run the convenience script (mocks the pipeline step):

```bash
cd backend
npm run test:step1
```

Option B: Hit the API endpoint directly:

```bash
curl -X POST http://localhost:8000/api/chat/extract \
  -H "Content-Type: application/json" \
  -d '{"domain": "patagonia.com"}'
```

_Note: The API endpoint returns Server-Sent Events (SSE)._

**Step 2: Strategic Analysis Only**

Option A: Run the convenience script:

```bash
cd backend
npm run test:step2
```

Option B: Hit the API endpoint with a valid JSON payload:

```bash
curl -X POST http://localhost:8000/api/chat/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "amazon_presence": true,
    "confidence_level": "High",
    "primary_category": "Example Category",
    "top_products": [{"name": "Test Product", "price": "$20", "rating": "4.5/5", "url": "http://example.com"}],
    "estimated_product_count": "50+"
  }'
```

_Returns: JSON object with 3 strategic insights._

---

## 🧠 Tool & AI Selection

### 1. LLM: Claude 3.5 Sonnet

**Choice**: `claude-3-5-sonnet-20241022`
**Why this stack?**: The project requires high-fidelity data extraction from noisy search results and raw text data, alongside nuanced strategic reasoning. Sonnet offers the best balance of reasoning capability and speed for this task, superior to GPT-3.5 or Haiku for minimizing hallucinations in the "Insights" phase.

### 2. Search API: Serper.dev

**Choice**: Google Shopping & Search via Serper.
**Why this stack?**: Direct Amazon scraping (via Puppeteer/Selenium) is brittle due to frequent DOM changes and anti-bot measures. Serper provides structured Google Shopping data which acts as a reliable proxy for Amazon inventory, pricing, and ratings without the maintenance overhead of a custom scraper.

### 3. Agent Framework: Mastra

**Why this stack?**: Provides a structured way to define tools, workflows, and schemas. It handles the "glue" between the LLM and the tools, ensuring type safety with Zod schemas.

---

## 📋 How it Works

1.  **Prompt Engineering**:
    - **Persona**: "Advanced E-commerce Intelligence Analyst" ensures the model adopts a critical, objective tone.
    - **Confidence Hierarchy**: The prompt explicitly instructs the model to categorize brand presence into High/Medium/Low tiers based on specific evidence (e.g., "Official Store" link).
    - **Structured Output**: Using Zod schemas forces the LLM to output clean JSON, eliminating regex parsing steps.

2.  **Safety & Error Handling**:
    - The schema allows for nullable fields.
    - Fallback logic checks for empty products to determine "No Presence".
    - `try/catch` blocks in API routes handle stream failures gracefully.

---

## ⏱️ Time Log (Estimated) & Demo Plan

- **Architecture & Setup**: 30m
- **Step 1 (Extraction Logic)**: ~1 hour
- **Step 2 (Strategy Prompts)**: ~1.5 hours
- **DUI & Integration:**: ~30 minutes

### Demo Brands Suggested

1.  **Patagonia.com** (Strong Presence)
2.  **Glossier.com** (Mixed/Reseller Presence)
3.  **LocalBakery.com** (Likely No Presence)

---

## 🔮 Production Recommendations

1.  **Caching**: Implement Redis caching for search results to reduce API costs and latency for repeated queries.
2.  **Rate Limiting**: Add strict rate limits on the API to prevent abuse.
3.  **Proxy Rotation**: If switching to direct scraping, implement residential proxy rotation.
4.  **History**: Save audit reports to a database (PostgreSQL) for historical trend analysis.
