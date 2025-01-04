import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Advocate } from "@/db/schema";

interface FetchAdvocatesParams {
  page: number;
  pageSize: number;
  search?: string;
}

interface AdvocatesResponse {
  data: Advocate[];
  totalPages: number;
  totalItems: number;
}

async function fetchAdvocates({
  page,
  pageSize,
  search,
}: FetchAdvocatesParams): Promise<AdvocatesResponse> {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
  });

  const response = await fetch(`/api/advocates?${searchParams}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useAdvocates(params: FetchAdvocatesParams) {
  return useQuery({
    queryKey: ["advocates", params],
    queryFn: () => fetchAdvocates(params),
    placeholderData: keepPreviousData,
  });
}
