"use server";

import { searchAll } from "./queries";

export async function searchAction(formData: FormData) {
  const query = String(formData.get("query") ?? "");

  return searchAll(query);
}