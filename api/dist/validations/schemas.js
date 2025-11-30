"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.reservaUpdateSchema = exports.reservaSchema = exports.userUpdateSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    nome: zod_1.z.string()
        .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
        .max(100, { message: "O nome não pode ter mais de 100 caracteres" }),
    email: zod_1.z.string()
        .email({ message: "E-mail inválido" })
        .max(100, { message: "O e-mail não pode ter mais de 100 caracteres" }),
    telefone: zod_1.z.string()
        .min(10, { message: "Telefone inválido" })
        .max(20, { message: "Telefone muito longo" }),
    apartamento: zod_1.z.number()
        .int({ message: "O número do apartamento deve ser um número inteiro" })
        .positive({ message: "O número do apartamento deve ser positivo" })
});
exports.userUpdateSchema = exports.userSchema.partial();
const dateSchema = zod_1.z.coerce.date({
    message: "Formato de data inválido"
});
const STATUS_RESERVA = ["pendente", "confirmada", "cancelada", "finalizada"];
exports.reservaSchema = zod_1.z.object({
    data: dateSchema.superRefine((date, ctx) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "A data não pode ser no passado"
            });
        }
    }),
    horaInicio: dateSchema,
    horaFim: dateSchema.superRefine((date, ctx) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        if (date < startOfDay || date > endOfDay) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "O horário final não pode ultrapassar o dia da reserva"
            });
        }
    }),
    observacao: zod_1.z.string()
        .max(500, { message: "A observação não pode ter mais de 500 caracteres" })
        .optional()
        .nullable(),
    status: zod_1.z.enum(STATUS_RESERVA).default("pendente")
        .refine((val) => STATUS_RESERVA.includes(val), { message: `Status inválido. Use: ${STATUS_RESERVA.join(", ")}` }),
    userId: zod_1.z.number({
        message: "O ID do usuário é obrigatório"
    })
        .int()
        .positive({ message: "O ID do usuário deve ser maior que zero" })
});
exports.reservaUpdateSchema = exports.reservaSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "Pelo menos um campo deve ser fornecido para atualização" });
exports.idSchema = zod_1.z.number({
    message: "ID deve ser um número"
})
    .int()
    .positive({
    message: "ID deve ser um número positivo"
});
