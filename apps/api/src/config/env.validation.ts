import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    // Server Configuration
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(8080),
    API_PREFIX: Joi.string().default('api/v1'),

    // Database Configuration
    DB_HOST: Joi.string().required().messages({
        'any.required': 'DB_HOST is required. Set it in your .env file.',
    }),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required().messages({
        'any.required': 'DB_USERNAME is required. Set it in your .env file.',
    }),
    DB_PASSWORD: Joi.string().required().messages({
        'any.required': 'DB_PASSWORD is required. Set it in your .env file.',
    }),
    DB_DATABASE: Joi.string().required().messages({
        'any.required': 'DB_DATABASE is required. Set it in your .env file.',
    }),

    // JWT Configuration
    JWT_SECRET: Joi.string().min(16).required().messages({
        'any.required': 'JWT_SECRET is required for security.',
        'string.min': 'JWT_SECRET must be at least 16 characters.',
    }),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    JWT_REFRESH_SECRET: Joi.string().min(16).optional(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

    // CORS
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

    // Razorpay (optional in development)
    RAZORPAY_KEY_ID: Joi.string().optional(),
    RAZORPAY_KEY_SECRET: Joi.string().optional(),
});
