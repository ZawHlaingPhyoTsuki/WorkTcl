"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CompanyFormValues, companySchema } from "@/lib/CompanySchema";

export default function CompanyForm() {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      facebook: "",
      telegram: "",
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      await axios.post("/api/companies", values);
      toast.success("Company created successfully!");
      form.reset();
    } catch {
      toast.error("Failed to create company");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Create Your Company</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="ABC Co., Ltd" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="company@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="09xxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Facebook */}
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook Page URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://facebook.com/yourpage"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telegram */}
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://t.me/yourchannel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end">
            <Button type="submit">Create Company</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
