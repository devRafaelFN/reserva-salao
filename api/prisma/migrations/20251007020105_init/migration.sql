-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "apartamento" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFim" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
