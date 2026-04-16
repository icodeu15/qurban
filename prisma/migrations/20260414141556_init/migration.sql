-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('KAMBING', 'SAPI', 'KERBAU', 'AQIQAH');

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "price" INTEGER,
    "label" TEXT,
    "image" TEXT,
    "externalUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."Category",
    "price" INTEGER,
    "label" TEXT,
    "image" TEXT,
    "externalUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "headline" TEXT,
    "subheadline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."Category",
    "price" INTEGER,
    "label" TEXT,
    "image" TEXT,
    "externalUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "content" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'feature',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);
