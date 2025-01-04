import { NextRequest } from 'next/server';
import db from "@/db";
import { ilike, or, sql } from 'drizzle-orm'
import { advocates } from '@/db/schema';

/**
 * GET /api/advocates
 * Fetches a paginated list of advocates
 * @param {NextRequest} request
 * @returns {Response}
 */
export async function GET(request: NextRequest) {
  // Parse the pagination parameters from the query string
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const search = searchParams.get('search') || ''

  const offset = (page - 1) * pageSize

  try {
    // Initialize the query in dynamic mode so we can
    // add multiple or ilike conditions to search all the
    // fields at once
    let query = db.select().from(advocates).$dynamic()

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
      )
    }

    // total count for pagination
    const totalItems = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .execute()
      .then(res => res[0].count)

    // Get the paginated results
    const data = await query
      .limit(pageSize)
      .offset(offset)
      .execute()

    return Response.json({
      data,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems
    })
  } catch (error) {
    console.error('Error fetching advocates:', error)
    return Response.json(
      { error: 'Failed to fetch advocates' },
      { status: 500 }
    )
  }
}