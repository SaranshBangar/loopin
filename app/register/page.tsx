"use client";

import { useState, useCallback, useMemo } from "react";
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
import { toast } from "@/hooks/use-toast";
import { start } from "repl";

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

const page = () => {
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

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 5000,
    }: {
      title: string;
      description: string;
      variant?: "default" | "destructive";
      duration?: number;
    }) => {
      return toast({
        title,
        description,
        variant,
        duration,
      });
    },
    []
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return;

    showToast({
      title: "Creating your account",
      description: "Please wait while we set up your account...",
      duration: Infinity,
    });

    setLoading(true);

    try {
      const usernameCheck = (await apiClient.validateUsername(values.username)) as any;

      if (usernameCheck.error?.startsWith("Username already exists")) {
        showToast({
          variant: "destructive",
          title: "Username not available",
          description: "This username is already taken. Please choose another one.",
        });
        return;
      }

      const existingUser = (await apiClient.registerUser(
        values.email,
        values.username,
        values.password,
        "https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      )) as any;

      if (existingUser.error) {
        showToast({
          variant: "destructive",
          title: "Registration failed",
          description: "Your account already exists. Redirecting you to login...",
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
        router.push("/login");
        return;
      }

      showToast({
        title: "Welcome aboard! 🎉",
        description: "Your account has been created successfully. Redirecting you to login...",
        duration: 3000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      showToast({
        variant: "destructive",
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidSubmit = () => {
    showToast({
      variant: "destructive",
      title: "Invalid form data",
      description: "Please check your inputs and try again.",
      duration: 4000,
    });
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Enter your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} disabled={loading} />
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
                        <Input placeholder="Choose a username" {...field} disabled={loading} />
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
                        <Input placeholder="Create a password" type="password" {...field} disabled={loading} />
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
                            disabled={loading}
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" disabled={loading}>
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  if (date) {
                                    setInputValue(format(date, "dd-MM-yyyy"));
                                  }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01") || loading}
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

                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
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

export default page;
