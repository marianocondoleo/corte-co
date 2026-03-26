ALTER TABLE "solicitud_status_history" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DEFAULT 'enviada'::text;--> statement-breakpoint
UPDATE "solicitudes" SET "status" = 'enviada' WHERE "status" = 'draft' OR "status" = 'submitted';--> statement-breakpoint
UPDATE "solicitudes" SET "status" = 'aprobada_pendiente_pago' WHERE "status" = 'approved' OR "status" = 'payment_pending';--> statement-breakpoint
UPDATE "solicitudes" SET "status" = 'en_produccion' WHERE "status" = 'in_production';--> statement-breakpoint
UPDATE "solicitudes" SET "status" = 'despachado' WHERE "status" = 'shipped';--> statement-breakpoint
UPDATE "solicitudes" SET "status" = 'recibida' WHERE "status" = 'delivered';--> statement-breakpoint
UPDATE "solicitud_status_history" SET "status" = 'enviada' WHERE "status" = 'draft' OR "status" = 'submitted';--> statement-breakpoint
UPDATE "solicitud_status_history" SET "status" = 'aprobada_pendiente_pago' WHERE "status" = 'approved' OR "status" = 'payment_pending';--> statement-breakpoint
UPDATE "solicitud_status_history" SET "status" = 'en_produccion' WHERE "status" = 'in_production';--> statement-breakpoint
UPDATE "solicitud_status_history" SET "status" = 'despachado' WHERE "status" = 'shipped';--> statement-breakpoint
UPDATE "solicitud_status_history" SET "status" = 'recibida' WHERE "status" = 'delivered';--> statement-breakpoint
DROP TYPE "public"."solicitud_status";--> statement-breakpoint
CREATE TYPE "public"."solicitud_status" AS ENUM('enviada', 'aprobada_pendiente_pago', 'en_produccion', 'despachado', 'recibida', 'cancelada');--> statement-breakpoint
ALTER TABLE "solicitud_status_history" ALTER COLUMN "status" SET DATA TYPE "public"."solicitud_status" USING "status"::"public"."solicitud_status";--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DEFAULT 'enviada'::"public"."solicitud_status";--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DATA TYPE "public"."solicitud_status" USING "status"::"public"."solicitud_status";