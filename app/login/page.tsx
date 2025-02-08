"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  identifier: z.string().min(1, "This field is required"),
  password: z.string(),
});

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<"username" | "email">("username");
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const data = await apiClient.loginUser(form.getValues("identifier"), form.getValues("password"));
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
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Login to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="username" className="w-full" onValueChange={(value) => setLoginMethod(value as "username" | "email")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="username">Username</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{loginMethod === "username" ? "Username" : "Email"}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={loginMethod === "username" ? "Enter your username" : "Enter your email"}
                            type={loginMethod === "email" ? "email" : "text"}
                            {...field}
                          />
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
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loading ? (
                    <Button disabled className="w-full">
                      <Loader2 className="animate-spin" />
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  )}
                </form>
              </Form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
            <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Login;
