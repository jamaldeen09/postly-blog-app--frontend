"use client"
import z from "zod"

const basicAuthSchema = z.object({
    email: z.string().email({ error: "Invalid email address" }),
    password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});

const useSignupSchema = () => {
    const schema = basicAuthSchema.extend({
        username: z.string()
            .min(1, { message: "Username is required" })
            .max(20, { message: "Username must be 20 characters or fewer" })
            .regex(/^[a-z0-9-]+$/, {
                message: "Username may only contain lowercase letters, numbers, and hyphens",
            })
            .regex(/^[a-z0-9]/, {
                message: "Username must start with a letter or number",
            })
            .regex(/.*[a-z0-9]$/, {
                message: "Username cannot end with a hyphen",
            })
            .regex(/^(?!.*--).*$/, {
                message: "Username cannot contain consecutive hyphens",
            }),
    });

    return { schema } as {
        schema: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            username: z.ZodString;
        }, z.core.$strip>
    }
}


const useLoginSchema = () => {
    const schema = basicAuthSchema

    return { schema } as {
        schema: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>
    }
}

const useBlogPostCreationSchema = () => {
    const schema = z.object({
        category: z.string().min(3, { error: "Category must be at least 3 chracters" })
            .max(30, "Category cannot exceed 30 characters"),
        title: z.string().min(5, { error: "Blog post title must be at least 5 characters" })
            .max(100, { error: "Blog post title cannot exceed 100 characters" }),
        content: z.string().min(100, { error: "Blog post content must be at least 100 characters" })
            .max(2000, { error: "Blog post content cannot exceed 2000 characters" })
    });

    return { schema } as {
        schema: z.ZodObject<{
            category: z.ZodString;
            title: z.ZodString;
            content: z.ZodString;
        }, z.core.$strip>
    }
}


export {
    useSignupSchema,
    useLoginSchema,
    useBlogPostCreationSchema
}