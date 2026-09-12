-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "verified_flag" BOOLEAN NOT NULL DEFAULT false,
    "trust_score" DECIMAL(5,2),
    "ai_score_source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "contract_id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "principal" DECIMAL(12,2) NOT NULL,
    "share_pct" DECIMAL(5,2) NOT NULL,
    "cap_amount" DECIMAL(12,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "apr_equivalent" DECIMAL(8,2),
    "platform_fee_pct" DECIMAL(5,2),
    "weekly_minimum" DECIMAL(12,2),
    "total_repaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ai_recommended_cap" DECIMAL(12,2),
    "ai_risk_rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "Funding" (
    "funding_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "amount_committed" DECIMAL(12,2) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("funding_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "txn_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "merchant_share" DECIMAL(12,2) NOT NULL,
    "investor_share" DECIMAL(12,2) NOT NULL,
    "platform_fee" DECIMAL(12,2) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotency_key" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("txn_id")
);

-- CreateTable
CREATE TABLE "InventoryCheckpoint" (
    "checkpoint_id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "reported_stock" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo_url" TEXT,
    "ai_inventory_estimate" INTEGER,
    "mismatch_flag" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InventoryCheckpoint_pkey" PRIMARY KEY ("checkpoint_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Contract_merchant_id_idx" ON "Contract"("merchant_id");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "Funding_contract_id_idx" ON "Funding"("contract_id");

-- CreateIndex
CREATE INDEX "Funding_investor_id_idx" ON "Funding"("investor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotency_key_key" ON "Transaction"("idempotency_key");

-- CreateIndex
CREATE INDEX "Transaction_contract_id_idx" ON "Transaction"("contract_id");

-- CreateIndex
CREATE INDEX "Transaction_payment_id_idx" ON "Transaction"("payment_id");

-- CreateIndex
CREATE INDEX "InventoryCheckpoint_merchant_id_idx" ON "InventoryCheckpoint"("merchant_id");

-- CreateIndex
CREATE INDEX "InventoryCheckpoint_contract_id_idx" ON "InventoryCheckpoint"("contract_id");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCheckpoint" ADD CONSTRAINT "InventoryCheckpoint_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCheckpoint" ADD CONSTRAINT "InventoryCheckpoint_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE RESTRICT ON UPDATE CASCADE;
