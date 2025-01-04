import { NextRequest } from "next/server";
import db from "@/db";
import { ilike, or, sql } from "drizzle-orm";
import { advocates } from "@/db/schema";

/**
 * GET /api/advocates
 * Fetches a paginated list of advocates
 * @param {NextRequest} request
 * @returns {Response}
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";

  const offset = (page - 1) * pageSize;

  try {
    // Main data query with search filter
    let query = db.select().from(advocates).$dynamic();

    // Add search condition if search parameter exists.
    // This would be a really inefficient and slow query
    // if we didn't add the full text index to the schema.
    // If the datasets become very large, we may want to consider
    // using ElasticSearch.
    // Should also run an EXPLAIN on the table to make sure the index
    // is being used properly and an EXPAIN ANALYZE to see the query
    // performance.
    //
    // Another consideration is discussing with product which fields
    // are most important to search on and which are less important.

    if (search) {
      query = query.where(
        or(
          ilike(advocates.firstName, `%${search}%`),
          ilike(advocates.lastName, `%${search}%`),
          ilike(advocates.city, `%${search}%`),
          ilike(advocates.degree, `%${search}%`)
        )
      );
    }

    const data = await query.limit(pageSize).offset(offset).execute();

    // Total items query with the same search filter
    const totalItemsQuery = db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(advocates)
      .where(
        or(
          ilike(advocates.firstName, `%${search}%`),
          ilike(advocates.lastName, `%${search}%`),
          ilike(advocates.city, `%${search}%`),
          ilike(advocates.degree, `%${search}%`)
        )
      );

    const totalItemsResult = await totalItemsQuery.execute();
    const totalItems = totalItemsResult[0].count;
    const totalPages = Math.ceil(totalItems / pageSize);

    return Response.json({
      data,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
