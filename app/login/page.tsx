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
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  identifier: z.string().min(1, "This field is required"),
  password: z.string().min(1, "Password is required"),
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
    const loadingToast = toast({
      title: "Logging in...",
      description: "Please wait while we verify your credentials",
    });

    setLoading(true);
    try {
      const data = (await apiClient.loginUser(values.identifier, values.password)) as { error?: string };

      loadingToast.dismiss();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: data.error || "Invalid credentials. Please try again.",
        });
      } else {
        toast({
          variant: "default",
          title: "Welcome back!",
          description: "You have successfully logged in.",
          className: "bg-green-500 text-white",
        });
      }
    } catch (error) {
      console.error("Failed to login user:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was a problem connecting to the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality coming soon!",
      variant: "default",
    });
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

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
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
            <Button variant="link" className="text-sm" onClick={handleForgotPassword}>
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Login;
