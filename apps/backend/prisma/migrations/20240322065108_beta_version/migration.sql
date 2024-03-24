-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SELLER');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('FR');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'OPEN', 'COMPLETE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('INITIATED', 'IN_SHIPMENT', 'SHIPPED', 'DELIVERED', 'RETRIEVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('NEW', 'MINT', 'GOOD', 'BAD', 'BROKEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "hashed_rt" TEXT,
    "roles" "Role"[],
    "confirmation_id" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "default_customer_address_id" TEXT,
    "default_seller_address_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "nick_name" TEXT,
    "avatar_url" TEXT,
    "biography" TEXT,
    "social_links" TEXT[],
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "personal_informations" (
    "first_name" TEXT,
    "last_name" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_informations_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "number_and_street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" "Country" NOT NULL DEFAULT 'FR',
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "has_box" BOOLEAN NOT NULL,
    "state_box" TEXT,
    "has_game" BOOLEAN NOT NULL,
    "state_game" TEXT,
    "price" INTEGER NOT NULL,
    "images" TEXT[],
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "generation" INTEGER NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "square_logo_url" TEXT NOT NULL,
    "rectangle_logo_url" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "item_amount" INTEGER NOT NULL,
    "tax_amount" INTEGER NOT NULL DEFAULT 0,
    "shipping_amount" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "session_url" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "amount_total" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipping" (
    "id" TEXT NOT NULL,
    "carrier_name" TEXT NOT NULL,
    "instructions" TEXT,
    "status" "ShippingStatus" NOT NULL DEFAULT 'INITIATED',
    "relay_id" TEXT NOT NULL,
    "expedition_number" TEXT,
    "sticker_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_games" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "edition" TEXT,
    "region" TEXT,
    "tags" TEXT[],
    "age_rating" INTEGER,
    "editor" TEXT,
    "developer" TEXT,
    "release_date" TIMESTAMP(3),
    "max_multiplayer_local_players" INTEGER,
    "max_multiplayer_online_players" INTEGER,
    "initial_purchase_price" DECIMAL(65,30),
    "negotiated_purchase_price" DECIMAL(65,30),
    "estimated_value" DECIMAL(65,30),
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "platform_id" TEXT NOT NULL,
    "collectionId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_game_boxes" (
    "state_box" "State" NOT NULL,
    "photo_front_side_box" TEXT,
    "photo_back_side_box" TEXT,
    "photo_spine_box" TEXT,
    "photo_inside_box" TEXT,
    "video_game_id" TEXT NOT NULL,

    CONSTRAINT "video_game_boxes_pkey" PRIMARY KEY ("video_game_id")
);

-- CreateTable
CREATE TABLE "video_game_games" (
    "state_game" "State" NOT NULL,
    "photo_front_game" TEXT,
    "photo_back_game" TEXT,
    "video_game_id" TEXT NOT NULL,

    CONSTRAINT "video_game_games_pkey" PRIMARY KEY ("video_game_id")
);

-- CreateTable
CREATE TABLE "video_game_extra_contents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "video_game_id" TEXT NOT NULL,

    CONSTRAINT "video_game_extra_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_default_customer_address_id_key" ON "User"("default_customer_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_default_seller_address_id_key" ON "User"("default_seller_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_informations_user_id_key" ON "personal_informations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_id_key" ON "addresses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "items_id_key" ON "items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contents_id_key" ON "contents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_id_key" ON "platforms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_name_key" ON "platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_short_name_key" ON "platforms"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_item_id_key" ON "orders"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_user_id_item_id_key" ON "orders"("user_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_id_key" ON "Shipping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_order_id_key" ON "Shipping"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "collections_id_key" ON "collections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "video_games_id_key" ON "video_games"("id");

-- CreateIndex
CREATE UNIQUE INDEX "video_game_boxes_video_game_id_key" ON "video_game_boxes"("video_game_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_game_games_video_game_id_key" ON "video_game_games"("video_game_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_game_extra_contents_id_key" ON "video_game_extra_contents"("id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_informations" ADD CONSTRAINT "personal_informations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_games" ADD CONSTRAINT "video_games_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_games" ADD CONSTRAINT "video_games_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_game_boxes" ADD CONSTRAINT "video_game_boxes_video_game_id_fkey" FOREIGN KEY ("video_game_id") REFERENCES "video_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_game_games" ADD CONSTRAINT "video_game_games_video_game_id_fkey" FOREIGN KEY ("video_game_id") REFERENCES "video_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_game_extra_contents" ADD CONSTRAINT "video_game_extra_contents_video_game_id_fkey" FOREIGN KEY ("video_game_id") REFERENCES "video_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
