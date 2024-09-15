'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const getRandomMessages = (questions: { question: string }[], count: number) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((q) => q.question);
};

const questions = [
  { question: 'What’s something that always inspires you?' },
  { question: 'What’s a language you’d love to speak fluently?' },
  { question: "What's your favorite movie?" },
  { question: 'Do you have any pets?' },
  { question: "What's your dream job?" },
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false); // New state for skeleton

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = () => {
    setLoadingSuggestions(true); // Start loading
    setTimeout(() => {
      const randomMessages = getRandomMessages(questions, 3);
      setSuggestedMessages(randomMessages);
      setLoadingSuggestions(false); // Stop loading after messages are fetched
    }, 1500); // Simulate a delay to fetch suggestions
  };

  return (
    <div className="font-bold text-violet-700 container mx-auto my-8 p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="bg-indigo-600 text-white flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2 text-center">
          <Button
            onClick={fetchSuggestedMessages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            Suggest Messages
          </Button>
          <p className="text-gray-600">Click on any message below to select it.</p>
        </div>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="p-4 bg-gray-100 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
          </CardHeader>
          <CardContent className="p-4 flex flex-col space-y-4">
            {loadingSuggestions ? (
              <>
                <Skeleton className="h-16 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-2" />
              </>
            ) : suggestedMessages.length > 0 ? (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 border border-gray-300 hover:bg-gray-100 text-gray-700"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 text-gray-700">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
