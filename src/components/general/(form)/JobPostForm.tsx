"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormValues } from "@/lib/FormSchema";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface JobPostFormProps {
  onSuccess?: () => void;
}

export function JobPostForm({ onSuccess }: JobPostFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "FULL_TIME",
      facebookUrl: "",
      salaryMin: 0,
      salaryMax: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/jobs", values);
      form.reset();
      toast.success("Job posted successfully!");
      onSuccess?.();
    } catch {
      toast.error("Failed to post job");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Job Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Senior Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job responsibilities..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Tachileik" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Facebook URL */}
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://facebook.com/yourUsername"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          {/* Job Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                    <SelectItem value="PART_TIME">Part-Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Min */}
          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Max */}
          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="80000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" className="w-fit">
            Post Job
          </Button>
        </div>
      </form>
    </Form>
  );
}
