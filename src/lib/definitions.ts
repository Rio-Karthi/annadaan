import { z } from 'zod';

export const SignupFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z.string()
        .min(6, { message: 'Be at least 6 characters long.' })
        .trim(),
    role: z.enum(['DONOR', 'RECEIVER'], { message: 'Please select a primary role.' }),
});

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password field must not be empty.' }),
});

export type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
    };
    message?: string;
};
