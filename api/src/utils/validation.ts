import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Middleware para validação de dados usando Zod
 * @param schema - Esquema Zod para validação
 * @param property - Propriedade do request a ser validada (body, params, query)
 */
export const validate = (schema: z.ZodSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[property];
      if (!data) {
        return res.status(400).json({
          message: 'Erro de validação',
          errors: [{ field: property, message: `${property} não pode estar vazio` }]
        });
      }
      
      const result = schema.safeParse(data);
      
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join('.') || property,
          message: issue.message
        }));
        
        return res.status(400).json({
          message: 'Erro de validação',
          errors
        });
      }
      
      // Se a validação for bem-sucedida, atualiza os dados com os valores validados
      req[property] = result.data;
      next();
    } catch (error) {
      console.error('Erro na validação:', error);
      res.status(500).json({
        message: 'Erro interno do servidor durante a validação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
};

/**
 * Função para validar um ID
 */
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      message: 'ID inválido',
      details: 'O ID deve ser um número inteiro positivo'
    });
  }
  
  // Adiciona o ID validado ao response.locals para uso posterior
  res.locals.validatedId = id;
  next();
};