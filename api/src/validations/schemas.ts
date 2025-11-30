import { z } from "zod";

export const userSchema = z.object({
  nome: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres" }),

  email: z.string()
    .email({ message: "E-mail inválido" })
    .max(100, { message: "O e-mail não pode ter mais de 100 caracteres" }),

  telefone: z.string()
    .min(10, { message: "Telefone inválido" })
    .max(20, { message: "Telefone muito longo" }),

  apartamento: z.number()
    .int({ message: "O número do apartamento deve ser um número inteiro" })
    .positive({ message: "O número do apartamento deve ser positivo" })
});

export const userUpdateSchema = userSchema.partial();

const dateSchema = z.coerce.date({
  message: "Formato de data inválido"
});

const STATUS_RESERVA = ["pendente", "confirmada", "cancelada", "finalizada"] as [string, string, string, string];

export const reservaSchema = z.object({
  data: dateSchema.superRefine((date, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
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
        code: z.ZodIssueCode.custom,
        message: "O horário final não pode ultrapassar o dia da reserva"
      });
    }
  }),

  observacao: z.string()
    .max(500, { message: "A observação não pode ter mais de 500 caracteres" })
    .optional()
    .nullable(),

  status: z.enum(STATUS_RESERVA as [string, ...string[]]).default("pendente")
    .refine(
      (val) => STATUS_RESERVA.includes(val as any),
      { message: `Status inválido. Use: ${STATUS_RESERVA.join(", ")}` }
    ),
  userId: z.number({
    message: "O ID do usuário é obrigatório"
  })
    .int()
    .positive({ message: "O ID do usuário deve ser maior que zero" })
});

export const reservaUpdateSchema = reservaSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Pelo menos um campo deve ser fornecido para atualização" }
);

export const idSchema = z.number({
  message: "ID deve ser um número"
})
  .int()
  .positive({
    message: "ID deve ser um número positivo"
  });

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ReservaInput = z.infer<typeof reservaSchema>;
export type ReservaUpdateInput = z.infer<typeof reservaUpdateSchema>;
