CREATE TYPE "public"."cultural_category" AS ENUM('musica', 'danca', 'artesanato', 'festa');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "culturalChapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapterNumber" integer NOT NULL,
	"slug" varchar(96) NOT NULL,
	"title" varchar(160) NOT NULL,
	"subtitle" varchar(220) DEFAULT '' NOT NULL,
	"category" "cultural_category" NOT NULL,
	"territory" text NOT NULL,
	"territorialNote" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"illustrationLabel" varchar(200) NOT NULL,
	"photoUrl" varchar(2048) DEFAULT '' NOT NULL,
	"photoCredit" varchar(300) DEFAULT '' NOT NULL,
	"photoSourceUrl" varchar(2048) DEFAULT '' NOT NULL,
	"photoLicense" varchar(200) DEFAULT '' NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "culturalChapters_chapterNumber_unique" UNIQUE("chapterNumber"),
	CONSTRAINT "culturalChapters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "culturalExtraPageImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"pageId" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"imageUrl" varchar(2048) NOT NULL,
	"altText" varchar(500) DEFAULT '' NOT NULL,
	"credit" varchar(300) NOT NULL,
	"sourceUrl" varchar(2048) NOT NULL,
	"license" varchar(200) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "culturalExtraPages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapterSlug" varchar(96) NOT NULL,
	"sortOrder" integer NOT NULL,
	"eyebrow" varchar(120) DEFAULT 'Aprofundamento' NOT NULL,
	"title" varchar(220) NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "culturalSources" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapterSlug" varchar(96) NOT NULL,
	"title" text NOT NULL,
	"institution" varchar(200) NOT NULL,
	"sourceUrl" text NOT NULL,
	"note" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE INDEX "culturalExtraPageImages_pageId_idx" ON "culturalExtraPageImages" USING btree ("pageId");--> statement-breakpoint
CREATE INDEX "culturalExtraPages_chapterSlug_idx" ON "culturalExtraPages" USING btree ("chapterSlug");--> statement-breakpoint
CREATE INDEX "culturalSources_chapterSlug_idx" ON "culturalSources" USING btree ("chapterSlug");