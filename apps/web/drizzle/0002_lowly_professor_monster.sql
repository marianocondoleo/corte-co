ALTER TABLE "solicitud_status_history" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DEFAULT 'solicitud_enviada'::text;--> statement-breakpoint
DROP TYPE "public"."solicitud_status";--> statement-breakpoint
CREATE TYPE "public"."solicitud_status" AS ENUM('solicitud_enviada', 'aprobada_pendiente_pago', 'en_produccion', 'despachado', 'recibida', 'cancelada');--> statement-breakpoint
ALTER TABLE "solicitud_status_history" ALTER COLUMN "status" SET DATA TYPE "public"."solicitud_status" USING "status"::"public"."solicitud_status";--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DEFAULT 'solicitud_enviada'::"public"."solicitud_status";--> statement-breakpoint
ALTER TABLE "solicitudes" ALTER COLUMN "status" SET DATA TYPE "public"."solicitud_status" USING "status"::"public"."solicitud_status";