# ms-kafka-es-node.js

Microservices & Kafka & Elastic Search & Node.js

---

## Main Tech Stack

- Microservices architecture using Node.js (express.js & Typescript)
- Communication via Kafka message broker
- Integration with Elastic Search for advanced querying
- Stripe integration for payment processing
- PostgreSQL database with PGAdmin UI for management

## Service URLs

- **Auth service:** `http://localhost:3000/api/auth`
- **Product service:** `http://localhost:3003/api/products`
- **Order service:** `http://localhost:3001/api/orders`
- **Payment service:** `http://localhost:3002/api/payment`
- **PGAdmin UI:** `http://localhost:8080`
- **Stripe Dashboard:** `https://dashboard.stripe.com`

## Getting Started

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- Stripe account & API keys

### Installation

1. Clone the repository:

2. Install dependencies for each service:

   ```bash
   cd <service-folder>
   npm install
   ```

3. Start services(PGadmin, Postgres Server, Kafka) using Docker Compose:

   ```bash
   docker-compose up -d // inside db folder
   docker-compose up -d // inside broker folder
   ```

4. Environment Variables

   ```bash
   Each service requires its own `.env` file. Refer to the sample `.env.example` in each service directory.
   ```

5. each services has its own README.md file for setup

   ```bash
   ./db/README.md
   ./broker/README.md
   ```
