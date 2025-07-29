"use client";

import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  name: string;
  placeholder?: string;
}

export const SearchInput = ({ name, placeholder }: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`?${params.toString()}`);
  }, 300);

  return (
    <Input
      placeholder={placeholder}
      defaultValue={searchParams.get(name) || ""}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full max-w-sm"
    />
  );
};
