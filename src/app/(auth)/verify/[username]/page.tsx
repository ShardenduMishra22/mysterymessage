"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';

const Page = (() => {
    const router = useRouter();
    const param = useParams<{username : string}>()
    const {toast} = useToast();

    // z.infer is a utility provided by the zod library that allows you to extract the TypeScript type from a Zod schema.
    // It helps you derive the TypeScript type from a Zod schema automatically,
    // so you don't need to manually define the type that matches your validation schema.
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema),
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
        try{
            const response = await axios.post('/api/verify-code', {
                username : param.username,
                code : data.code
            })
            toast({
                title : 'Success',
                description : response.data.message,
            })
            router.replace('sign-in')

        }catch(error){
            console.error('Error during sign-up:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-500 rounded-lg shadow-md">
                <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Verify</Button>
                </form>
                </Form>
            </div>
        </div>
    );
})

export default Page
