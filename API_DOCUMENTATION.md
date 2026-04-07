# ExpoGen API Documentation

This documentation provides a guide to the endpoints available in the ExpoGen API, designed to facilitate a smooth integration for the frontend.

## 🚀 The Export Flow

The API is designed as a guided "Export Wizard". Most responses include a `next_steps` field that tells the frontend exactly what action to take next, which HTTP method to use, the URL, and pre-filled parameters.

**Standard Flow:**
1.  **Search HS Code** (`/hs-codes/search`)
2.  **Create Product** (`/products`)
3.  **Get Compliance Requirements** (`/compliance/ghana/{hs_code}`)
4.  **Check Readiness** (`/products/{product_id}/readiness`)
5.  **Upload Documents** (`/products/{product_id}/documents`)
6.  **Generate Operational Docs** (`/documents/generate`) (Invoice, Packing List, etc.)
7.  **Generate AI Contract** (`/contracts/generate`)
8.  **AI Legal Review** (`/contracts/review`)

---

## 🏗️ 1. HS Codes

### Search HS Codes
`GET /hs-codes/search?q={query}`
- **Query Params**: `q` (min 2 chars), `limit` (default 10)
- **Response**: List of HS codes with `next_steps` to create a product.

### Get HS Code Details
`GET /hs-codes/{hs_code}`
- **Response**: Details for a specific code.

---

## 📦 2. Products

### List All Products
`GET /products`
- **Query Params**: `name` (optional, case-insensitive partial match)
- **Response**: List of products with `next_steps` to check compliance and readiness.

### Get Product by ID
`GET /products/{product_id}`
- **Response**: Full details for a specific product.

### Create Product
`POST /products`
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "product_name": "Shea Butter",
    "description": "Organic unrefined shea butter",
    "selected_hs_code": "151590",
    "destination_country": "USA"
  }
  ```
- **Response**: Product details with `next_steps` to fetch compliance and check readiness.

### Get Detailed Product Compliance
`GET /products/{product_id}/compliance`
- **Response**: Full compliance requirements for both Ghana (export) and the destination country (import).

### Check Product Readiness
`GET /products/{product_id}/readiness`
- **Response**: A score (0-100), list of missing items, and `next_steps` to upload documents or generate operational files.

### Upload Document
`POST /products/{product_id}/documents`
- **Request Body**:
  ```json
  {
    "document_type": "Certificate of Analysis",
    "file_url": "https://storage.example.com/coa.pdf",
    "verified": false
  }
  ```

---

## 📜 3. Compliance

### Get Ghana Compliance
`GET /compliance/ghana/{hs_code}`
- **Response**: List of mandatory and optional requirements for the HS code.

---

## 📄 4. Operational Documents

### Generate Documents
Generates Commercial Invoice, Packing List, and Certificate of Origin.
`POST /documents/generate`
- **Request Body**:
  ```json
  {
    "product_id": 1,
    "consignee_name": "John Doe Corp",
    "consignee_address": "123 Business Way, New York, USA",
    "exporter_name": "Optional Name",
    "exporter_address": "Optional Address",
    "product_details": {
      "quantity": 100.0,
      "unit_price": 25.50,
      "net_weight": 5000.0,
      "gross_weight": 5100.0
    },
    "currency": "USD",
    "incoterms": "FOB"
  }
  ```
- **Response**: URLs to download the 3 generated PDFs and `next_steps` to generate an AI contract with pre-calculated price totals.

---

## ⚖️ 5. AI Contracts

### Generate AI Contract
Uses Lexiform AI to generate a legally grounded contract.
`POST /contracts/generate`
- **Request Body**:
  ```json
  {
    "product_id": 1,
    "consignee_name": "John Doe Corp",
    "consignee_address": "123 Business Way, New York, USA",
    "quantity": "100 metric tons",
    "quantity_value": 100.0,
    "price_per_unit": 25.50,
    "total_price": 2550.0,
    "incoterms": "FOB",
    "port_name": "Tema Port",
    "payment_terms": "30% deposit, 70% against documents",
    "governing_law": "Ghana",
    "dispute_resolution": "Arbitration in Accra"
  }
  ```
- **Response**: PDF download URL, AI legal review text, and any `warnings` (e.g., unresolved placeholders).

### Review Contract Text
`POST /contracts/review`
- **Request Body**:
  ```json
  {
    "contract_text": "Full text of the contract to review..."
  }
  ```
- **Response**: Detailed AI legal analysis and risk level.

---

## ⚙️ Shared Schemas

### NextStep Object
Every `next_steps` array contains objects like this:
```json
{
  "action": "action_name",
  "method": "GET/POST",
  "url": "/api/endpoint",
  "description": "Human readable description",
  "params": { "key": "value" }
}
```
