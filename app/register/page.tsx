"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  dob: z
    .date({
      required_error: "Please select a date of birth",
    })
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 13;
    }, "You must be at least 13 years old"),
});

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const data = await apiClient.registerUser(form.getValues("email"), form.getValues("username"), form.getValues("password"));
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to login user : ", error);
    }
    setLoading(false);
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Enter your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Create a password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => {
                    const [inputValue, setInputValue] = useState(field.value ? format(field.value, "dd-MM-yyyy") : "");

                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setInputValue(value);

                      const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
                      const match = value.match(dateRegex);

                      if (match) {
                        const [_, day, month, year] = match;
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                        // Validate if it's a real date and within allowed range
                        if (!isNaN(date.getTime()) && date >= new Date("1900-01-01") && date <= new Date()) {
                          field.onChange(date);
                        }
                      }
                    };

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="DD-MM-YYYY"
                            value={inputValue}
                            onChange={handleInputChange}
                            className={cn("w-full pl-3 pr-10", !field.value && "text-muted-foreground")}
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {loading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="animate-spin" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="w-full">
                    Login
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Register;
