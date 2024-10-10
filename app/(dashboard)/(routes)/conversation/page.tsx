'use client';

import Heading from '@/components/heading';
// app/chat/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Bot, MessageCirclePlus, TrainFront } from 'lucide-react';
import React, { useState } from 'react';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            // Simulate AI response
            setTimeout(() => {
                setMessages((prev) => [...prev, { text: `AI: ${input}`, sender: 'ai' }]);
            }, 500);
            setInput('');
        }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <Heading
        title="Chat Bot"
        description="Here to help."
        icon={Bot}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
      <Card  className='h-full'>
         <CardHeader className='w-full border-b border-gray-300'>
          <CardTitle className="flex items-center text-lg">
          <TrainFront className='mr-2' />
            Chat Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
        <div className="flex flex-col min-h-[300px]">
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <div
                            className={`inline-block p-2 rounded-lg ${
                                msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="flex p-2 border-t border-gray-300">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button type="submit" className="ml-2">
                    Send
                </Button>
            </form>
        </div>
          </CardContent>
      </Card>

      </div>

      </div>
    );
};

export default ChatPage;
