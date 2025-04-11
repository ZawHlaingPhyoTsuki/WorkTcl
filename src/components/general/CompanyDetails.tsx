"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import axios from "axios";

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  facebook?: string | null;
  telegram?: string | null;
  createdAt: string;
}

export default function CompanyDetails({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/companies/${companyId}`);
        setCompany(response.data);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.error || "Failed to fetch company"
            : "Failed to fetch company"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div>
              <Skeleton className="h-5 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px] mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="text-red-500 py-4">{error}</CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="py-4">Company not found.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground">
          View and manage your company information
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/company-logo.png" />
            <AvatarFallback>
              {company.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{company.name}</h2>
            <p className="text-muted-foreground">{company.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Contact Information</h3>
            <p className="text-muted-foreground">
              {company.phone || "Not provided"}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Social Links</h3>
            <p className="text-muted-foreground">
              {company.facebook ? (
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {company.facebook}
                </a>
              ) : (
                "Not provided"
              )}
            </p>
            <p className="text-muted-foreground">
              {company.telegram ? (
                <a
                  href={company.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {company.telegram}
                </a>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
