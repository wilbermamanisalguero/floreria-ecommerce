CREATE TABLE "productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"precio_minor" integer NOT NULL,
	"descripcion" text NOT NULL,
	"imagen_url" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "productos_nombre_no_vacio" CHECK ("productos"."nombre" <> ''),
	CONSTRAINT "productos_descripcion_no_vacia" CHECK ("productos"."descripcion" <> ''),
	CONSTRAINT "productos_imagen_url_no_vacia" CHECK ("productos"."imagen_url" <> ''),
	CONSTRAINT "productos_precio_minor_positivo" CHECK ("productos"."precio_minor" > 0)
);
